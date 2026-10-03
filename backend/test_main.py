import io
import json
import base64

import pytest
from PIL import Image
from reportlab.pdfgen import canvas
import openpyxl


def make_png(width=100, height=100, color=(255, 0, 0)):
    img = Image.new("RGB", (width, height), color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf


def make_rgba_png():
    img = Image.new("RGBA", (50, 50), (255, 0, 0, 128))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf


def make_pdf(text="Hello World"):
    buf = io.BytesIO()
    c = canvas.Canvas(buf)
    c.drawString(100, 750, text)
    c.save()
    buf.seek(0)
    return buf


def make_excel():
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.append(["name", "age", "city"])
    ws.append(["Alice", 30, "NYC"])
    ws.append(["Bob", 25, "LA"])
    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    return buf


async def test_health(client):
    resp = await client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert data["version"] == "1.0.0"


async def test_image_convert_png_to_jpg(client):
    png = make_png()
    resp = await client.post(
        "/api/image/convert?output_format=jpg",
        files={"file": ("test.png", png, "image/png")},
    )
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "image/jpeg"
    img = Image.open(io.BytesIO(resp.content))
    assert img.format == "JPEG"


async def test_image_convert_jpg_to_webp(client):
    img = Image.new("RGB", (50, 50), (0, 255, 0))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    resp = await client.post(
        "/api/image/convert?output_format=webp",
        files={"file": ("test.jpg", buf, "image/jpeg")},
    )
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "image/webp"


async def test_image_convert_rgba_to_jpg(client):
    png = make_rgba_png()
    resp = await client.post(
        "/api/image/convert?output_format=jpg",
        files={"file": ("test.png", png, "image/png")},
    )
    assert resp.status_code == 200
    img = Image.open(io.BytesIO(resp.content))
    assert img.mode == "RGB"


async def test_image_resize(client):
    png = make_png(200, 200)
    resp = await client.post(
        "/api/image/resize?width=100&height=100",
        files={"file": ("test.png", png, "image/png")},
    )
    assert resp.status_code == 200
    img = Image.open(io.BytesIO(resp.content))
    assert img.size == (100, 100)


async def test_image_compress(client):
    png = make_png(200, 200)
    resp = await client.post(
        "/api/image/compress?quality=50",
        files={"file": ("test.png", png, "image/png")},
    )
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "image/jpeg"


async def test_image_to_base64(client):
    png = make_png(10, 10)
    original = png.read()
    png.seek(0)
    resp = await client.post(
        "/api/image/to-base64",
        files={"file": ("test.png", png, "image/png")},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "base64" in data
    assert data["mime_type"] == "image/png"
    decoded = base64.b64decode(data["base64"])
    assert decoded == original


async def test_pdf_to_text(client):
    pdf = make_pdf("Hello World")
    resp = await client.post(
        "/api/pdf/to-text",
        files={"file": ("test.pdf", pdf, "application/pdf")},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "Hello World" in data["text"]
    assert data["pages"] >= 1


async def test_pdf_merge(client):
    pdf1 = make_pdf("Page One")
    pdf2 = make_pdf("Page Two")
    resp = await client.post(
        "/api/pdf/merge",
        files=[
            ("files", ("a.pdf", pdf1, "application/pdf")),
            ("files", ("b.pdf", pdf2, "application/pdf")),
        ],
    )
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "application/pdf"


async def test_pdf_compress(client):
    pdf = make_pdf("Compress me")
    resp = await client.post(
        "/api/pdf/compress",
        files={"file": ("test.pdf", pdf, "application/pdf")},
    )
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "application/pdf"


async def test_json_to_csv(client):
    data = json.dumps([{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}])
    resp = await client.post(
        "/api/data/json-to-csv",
        files={"file": ("data.json", io.BytesIO(data.encode()), "application/json")},
    )
    assert resp.status_code == 200
    assert "Alice" in resp.text
    assert "name" in resp.text


async def test_csv_to_json(client):
    csv_data = "name,age\nAlice,30\nBob,25\n"
    resp = await client.post(
        "/api/data/csv-to-json",
        files={"file": ("data.csv", io.BytesIO(csv_data.encode()), "text/csv")},
    )
    assert resp.status_code == 200
    records = resp.json()
    assert len(records) == 2
    assert records[0]["name"] == "Alice"


async def test_json_to_xml(client):
    data = json.dumps({"name": "Alice", "age": 30})
    resp = await client.post(
        "/api/data/json-to-xml",
        files={"file": ("data.json", io.BytesIO(data.encode()), "application/json")},
    )
    assert resp.status_code == 200
    assert b"Alice" in resp.content


async def test_xml_to_json(client):
    xml = "<root><name>Alice</name><age>30</age></root>"
    resp = await client.post(
        "/api/data/xml-to-json",
        files={"file": ("data.xml", io.BytesIO(xml.encode()), "application/xml")},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["root"]["name"] == "Alice"


async def test_excel_to_csv(client):
    xlsx = make_excel()
    resp = await client.post(
        "/api/data/excel-to-csv",
        files={"file": ("data.xlsx", xlsx, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
    )
    assert resp.status_code == 200
    assert "Alice" in resp.text
    assert "name" in resp.text


async def test_image_convert_invalid_format(client):
    png = make_png()
    resp = await client.post(
        "/api/image/convert?output_format=tiff",
        files={"file": ("test.png", png, "image/png")},
    )
    assert resp.status_code == 400


async def test_pdf_merge_single_file(client):
    pdf = make_pdf("Only one")
    resp = await client.post(
        "/api/pdf/merge",
        files=[("files", ("a.pdf", pdf, "application/pdf"))],
    )
    assert resp.status_code == 400
