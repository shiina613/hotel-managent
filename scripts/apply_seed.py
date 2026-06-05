#!/usr/bin/env python3
"""Apply hotel_management_seed_1month.sql to local MySQL."""
import pymysql
from pathlib import Path

SQL_FILE = Path(__file__).resolve().parents[1] / "hotel_management_seed_1month.sql"


def run():
    sql = SQL_FILE.read_text(encoding="utf-8")
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="123456",
        database="hotel_management",
        charset="utf8mb4",
    )
    cur = conn.cursor()
    for stmt in sql.split(";"):
        lines = [
            ln
            for ln in stmt.splitlines()
            if ln.strip() and not ln.strip().startswith("--")
        ]
        if not lines:
            continue
        cur.execute("\n".join(lines))
    conn.commit()

    for table in ("users", "bookings", "invoices", "service_usage"):
        cur.execute(f"SELECT COUNT(*) FROM `{table}`")
        print(f"{table}: {cur.fetchone()[0]}")

    cur.execute("SELECT `status`, COUNT(*) FROM `bookings` GROUP BY `status`")
    print("bookings by status:", cur.fetchall())

    cur.execute("SELECT `status`, COUNT(*) FROM `invoices` GROUP BY `status`")
    print("invoices by status:", cur.fetchall())

    conn.close()
    print("Seed applied OK.")


if __name__ == "__main__":
    run()
