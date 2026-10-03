import io
import csv
import json
import base64
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from PIL import Image
from PyPDF2 import PdfReader, PdfWriter
import openpyxl
import dicttoxml
import xmltodict

app = FastAPI(title="DoAide Convert API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_SIZE = 50 * 1024 * 1024

FORMAT_MIME = {
    "png": "image/png",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "webp": "image/webp",
    "bmp": "image/bmp",
}

PIL_FORMAT = {
    "png": "PNG",
    "jpg": "JPEG",
    "jpeg": "JPEG",
    "webp": "WEBP",
    "bmp": "BMP",
}


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


# ── Image endpoints ──────────────────────────────────────────────────────────

@app.post("/api/image/convert")
async def image_convert(
    file: UploadFile = File(...),
    output_format: str = Query(..., description="Target format: png, jpg, webp, bmp"),
):
    fmt = output_format.lower().strip()
    if fmt not in PIL_FORMAT:
        raise HTTPException(400, f"Unsupported format: {fmt}")
    try:
        data = await file.read()
        img = Image.open(io.BytesIO(data))
        if img.mode == "RGBA" and fmt in ("jpg", "jpeg", "bmp"):
            img = img.convert("RGB")
        buf = io.BytesIO()
        img.save(buf, format=PIL_FORMAT[fmt])
        buf.seek(0)
        return StreamingResponse(buf, media_type=FORMAT_MIME[fmt], headers={
            "Content-Disposition": f'attachment; filename="converted.{fmt}"'
        })
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/image/resize")
async def image_resize(
    file: UploadFile = File(...),
    width: int = Query(..., gt=0),
    height: int = Query(..., gt=0),
):
    try:
        data = await file.read()
        img = Image.open(io.BytesIO(data))
        img = img.resize((width, height), Image.LANCZOS)
        buf = io.BytesIO()
        out_fmt = img.format or "PNG"
        if img.mode == "RGBA" and out_fmt == "JPEG":
            img = img.convert("RGB")
        img.save(buf, format=out_fmt)
        buf.seek(0)
        mime = FORMAT_MIME.get(out_fmt.lower(), "image/png")
        return StreamingResponse(buf, media_type=mime, headers={
            "Content-Disposition": f'attachment; filename="resized.{out_fmt.lower()}"'
        })
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/image/compress")
async def image_compress(
    file: UploadFile = File(...),
    quality: int = Query(75, ge=1, le=100),
):
    try:
        data = await file.read()
        img = Image.open(io.BytesIO(data))
        if img.mode == "RGBA":
            img = img.convert("RGB")
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=quality, optimize=True)
        buf.seek(0)
        return StreamingResponse(buf, media_type="image/jpeg", headers={
            "Content-Disposition": 'attachment; filename="compressed.jpg"'
        })
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/image/to-base64")
async def image_to_base64(file: UploadFile = File(...)):
    try:
        data = await file.read()
        img = Image.open(io.BytesIO(data))
        fmt = (img.format or "PNG").lower()
        mime = FORMAT_MIME.get(fmt, "image/png")
        encoded = base64.b64encode(data).decode("utf-8")
        return JSONResponse({"base64": encoded, "mime_type": mime, "size": len(data)})
    except Exception as e:
        raise HTTPException(500, str(e))


# ── PDF endpoints ────────────────────────────────────────────────────────────

@app.post("/api/pdf/to-text")
async def pdf_to_text(file: UploadFile = File(...)):
    try:
        data = await file.read()
        reader = PdfReader(io.BytesIO(data))
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return JSONResponse({"text": text.strip(), "pages": len(reader.pages)})
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/pdf/merge")
async def pdf_merge(files: list[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(400, "At least 2 PDF files required")
    try:
        writer = PdfWriter()
        for f in files:
            data = await f.read()
            reader = PdfReader(io.BytesIO(data))
            for page in reader.pages:
                writer.add_page(page)
        buf = io.BytesIO()
        writer.write(buf)
        buf.seek(0)
        return StreamingResponse(buf, media_type="application/pdf", headers={
            "Content-Disposition": 'attachment; filename="merged.pdf"'
        })
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/pdf/compress")
async def pdf_compress(file: UploadFile = File(...)):
    try:
        data = await file.read()
        reader = PdfReader(io.BytesIO(data))
        writer = PdfWriter()
        for page in reader.pages:
            page.compress_content_streams()
            writer.add_page(page)
        buf = io.BytesIO()
        writer.write(buf)
        buf.seek(0)
        return StreamingResponse(buf, media_type="application/pdf", headers={
            "Content-Disposition": 'attachment; filename="compressed.pdf"'
        })
    except Exception as e:
        raise HTTPException(500, str(e))


# ── Data endpoints ───────────────────────────────────────────────────────────

@app.post("/api/data/json-to-csv")
async def json_to_csv(file: UploadFile = File(...)):
    try:
        data = await file.read()
        records = json.loads(data)
        if not isinstance(records, list) or len(records) == 0:
            raise HTTPException(400, "JSON must be a non-empty array of objects")
        buf = io.StringIO()
        writer = csv.DictWriter(buf, fieldnames=records[0].keys())
        writer.writeheader()
        writer.writerows(records)
        output = io.BytesIO(buf.getvalue().encode("utf-8"))
        return StreamingResponse(output, media_type="text/csv", headers={
            "Content-Disposition": 'attachment; filename="converted.csv"'
        })
    except HTTPException:
        raise
    except json.JSONDecodeError:
        raise HTTPException(400, "Invalid JSON")
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/data/csv-to-json")
async def csv_to_json(file: UploadFile = File(...)):
    try:
        data = await file.read()
        text = data.decode("utf-8")
        reader = csv.DictReader(io.StringIO(text))
        records = list(reader)
        return JSONResponse(records)
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/data/json-to-xml")
async def json_to_xml(file: UploadFile = File(...)):
    try:
        data = await file.read()
        obj = json.loads(data)
        xml_bytes = dicttoxml.dicttoxml(obj, custom_root="root", attr_type=False)
        output = io.BytesIO(xml_bytes)
        return StreamingResponse(output, media_type="application/xml", headers={
            "Content-Disposition": 'attachment; filename="converted.xml"'
        })
    except json.JSONDecodeError:
        raise HTTPException(400, "Invalid JSON")
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/data/xml-to-json")
async def xml_to_json(file: UploadFile = File(...)):
    try:
        data = await file.read()
        text = data.decode("utf-8")
        result = xmltodict.parse(text)
        return JSONResponse(result)
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/api/data/excel-to-csv")
async def excel_to_csv(file: UploadFile = File(...)):
    try:
        data = await file.read()
        wb = openpyxl.load_workbook(io.BytesIO(data), read_only=True)
        ws = wb.active
        buf = io.StringIO()
        writer = csv.writer(buf)
        for row in ws.iter_rows(values_only=True):
            writer.writerow(row)
        wb.close()
        output = io.BytesIO(buf.getvalue().encode("utf-8"))
        return StreamingResponse(output, media_type="text/csv", headers={
            "Content-Disposition": 'attachment; filename="converted.csv"'
        })
    except Exception as e:
        raise HTTPException(500, str(e))


if __name__ == "__main__":
    import uvicorn
    print("Starting DoAide Convert API on 172.18.0.1:3044")
    uvicorn.run(app, host="172.18.0.1", port=3044)
