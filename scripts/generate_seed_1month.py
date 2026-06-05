#!/usr/bin/env python3
"""Generate SQL seed: ~1 month hotel operations (2026-04-15 .. 2026-05-15)."""
from __future__ import annotations

import random
from datetime import datetime, timedelta
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "hotel_management_seed_1month.sql"
START = datetime(2026, 4, 15, 14, 0, 0)
END = datetime(2026, 5, 15, 12, 0, 0)
PWD_HASH = "$2a$12$T3Bzw9gU4kc7bulT77f9b.lD98OICuaKnlmkM6rqwKkDQFapJ1wP."  # Kh@123456

ROOMS = [
    {"id": 3, "num": "101", "price": 750_000},
    {"id": 4, "num": "202", "price": 1_500_000},
    {"id": 5, "num": "303", "price": 500_000},
    {"id": 7, "num": "404", "price": 700_000},
]

SERVICES = [
    {"id": 1, "name": "Spa", "price": 100_000},
    {"id": 2, "name": "Spa & Wellness", "price": 350_000},
    {"id": 5, "name": "Hồ bơi", "price": 100_000},
    {"id": 6, "name": "Nhà hàng", "price": 200_000},
    {"id": 7, "name": "Đưa đón sân bay", "price": 250_000},
    {"id": 8, "name": "Phòng gym", "price": 80_000},
    {"id": 9, "name": "Giặt ủi", "price": 50_000},
]

CUSTOMERS = [
    (11, "tran.anh", "tran.anh@gmail.com", "Trần Văn Anh", "0913001001"),
    (12, "le.thao", "le.thao@gmail.com", "Lê Thị Thảo", "0913001002"),
    (13, "pham.hung", "pham.hung@gmail.com", "Phạm Minh Hùng", "0913001003"),
    (14, "hoang.lan", "hoang.lan@gmail.com", "Hoàng Thị Lan", "0913001004"),
    (15, "vu.duc", "vu.duc@gmail.com", "Vũ Đức Thành", "0913001005"),
    (16, "dang.ha", "dang.ha@gmail.com", "Đặng Thu Hà", "0913001006"),
    (17, "bui.nam", "bui.nam@gmail.com", "Bùi Hoài Nam", "0913001007"),
    (18, "do.lin", "do.lin@gmail.com", "Đỗ Ngọc Linh", "0913001008"),
    (19, "ngo.phu", "ngo.phu@gmail.com", "Ngô Thanh Phú", "0913001009"),
    (20, "ly.chi", "ly.chi@gmail.com", "Lý Minh Chí", "0913001010"),
]

EXISTING_CUSTOMERS = [2, 5, 8, 9, 10]
ALL_CUSTOMERS = EXISTING_CUSTOMERS + [c[0] for c in CUSTOMERS]

random.seed(20260515)


def dt_str(d: datetime) -> str:
    return d.strftime("%Y-%m-%d %H:%M:%S.000000")


def nights_between(ci: datetime, co: datetime) -> int:
    return max(1, (co.date() - ci.date()).days)


def overlaps(a_start, a_end, b_start, b_end) -> bool:
    return a_start < b_end and b_start < a_end


def main():
    room_schedules = {r["id"]: [] for r in ROOMS}
    bookings = []
    booking_id = 1

    target_count = 55
    attempts = 0
    while len(bookings) < target_count and attempts < 800:
        attempts += 1
        room = random.choice(ROOMS)
        stay_nights = random.choices([1, 2, 3, 4, 5], weights=[35, 30, 20, 10, 5])[0]
        span_days = (END - START).days - stay_nights - 1
        if span_days < 1:
            continue
        offset = random.randint(0, span_days)
        check_in = START + timedelta(days=offset, hours=random.choice([13, 14, 15, 16]))
        check_out = check_in + timedelta(days=stay_nights, hours=random.choice([10, 11, 12]))
        if check_out > END + timedelta(days=2):
            continue
        if any(overlaps(check_in, check_out, s, e) for s, e in room_schedules[room["id"]]):
            continue
        room_schedules[room["id"]].append((check_in, check_out))
        nights = nights_between(check_in, check_out)
        room_price = room["price"]
        total = room_price * nights
        created = check_in - timedelta(days=random.randint(1, 5), hours=random.randint(0, 8))
        if created < START - timedelta(days=2):
            created = START + timedelta(hours=random.randint(0, 48))

        now = END
        if check_in <= now <= check_out:
            status = "CHECKED_IN"
        elif check_in > now:
            status = random.choices(["CONFIRMED", "PENDING"], weights=[70, 30])[0]
        elif check_out < now - timedelta(days=2):
            status = random.choices(["CHECKED_OUT", "CANCELLED"], weights=[85, 15])[0]
        else:
            status = random.choices(["CHECKED_OUT", "CANCELLED"], weights=[80, 20])[0]

        user_id = random.choice(ALL_CUSTOMERS)
        note = random.choice(["", "", "Khách VIP", "Đặt qua điện thoại", "Giảm 5% thành viên", "Cần giường phụ"])
        bookings.append({
            "id": booking_id,
            "user_id": user_id,
            "room_id": room["id"],
            "check_in": check_in,
            "check_out": check_out,
            "create_at": created,
            "update_at": check_out if status == "CHECKED_OUT" else max(created, check_in),
            "room_price": room_price,
            "total_price": total if status != "CANCELLED" else 0,
            "status": status,
            "note": note,
        })
        booking_id += 1

    bookings.sort(key=lambda b: b["check_in"])

    # Đảm bảo có khách đang ở và lịch sắp tới (phục vụ chụp màn hình)
    def add_fixed(bid, room, user, ci, co, created, status):
        nonlocal booking_id
        nights = nights_between(ci, co)
        bookings.append({
            "id": bid,
            "user_id": user,
            "room_id": room["id"],
            "check_in": ci,
            "check_out": co,
            "create_at": created,
            "update_at": co if status == "CHECKED_OUT" else ci,
            "room_price": room["price"],
            "total_price": room["price"] * nights,
            "status": status,
            "note": "",
        })
        room_schedules[room["id"]].append((ci, co))
        booking_id = max(booking_id, bid + 1)

    add_fixed(
        9001, ROOMS[0], 8,
        datetime(2026, 5, 13, 14, 0),
        datetime(2026, 5, 16, 11, 0),
        datetime(2026, 5, 10, 9, 0),
        "CHECKED_IN",
    )
    add_fixed(
        9002, ROOMS[1], 12,
        datetime(2026, 5, 14, 15, 0),
        datetime(2026, 5, 17, 10, 0),
        datetime(2026, 5, 12, 16, 0),
        "CHECKED_IN",
    )
    add_fixed(
        9003, ROOMS[3], 5,
        datetime(2026, 5, 18, 14, 0),
        datetime(2026, 5, 20, 11, 0),
        datetime(2026, 5, 14, 8, 0),
        "CONFIRMED",
    )
    add_fixed(
        9004, ROOMS[2], 15,
        datetime(2026, 5, 20, 13, 0),
        datetime(2026, 5, 22, 11, 0),
        datetime(2026, 5, 15, 10, 0),
        "PENDING",
    )

    bookings.sort(key=lambda b: b["check_in"])
    booking_id = max(b["id"] for b in bookings) + 1

    invoices = []
    service_rows = []
    invoice_id = 1
    su_id = 1

    for b in bookings:
        if b["status"] != "CHECKED_OUT":
            continue
        svc_total = 0
        if random.random() < 0.55:
            for svc in random.sample(SERVICES, k=random.randint(1, 3)):
                qty = random.randint(1, 3)
                unit = svc["price"]
                line = unit * qty
                svc_total += line
                use_at = b["check_in"] + timedelta(
                    hours=random.randint(12, max(13, (b["check_out"] - b["check_in"]).days * 24))
                )
                service_rows.append({
                    "id": su_id,
                    "booking_id": b["id"],
                    "service_id": svc["id"],
                    "quantity": qty,
                    "unit_price": unit,
                    "total_price": line,
                    "use_at": min(use_at, b["check_out"] - timedelta(hours=2)),
                })
                su_id += 1

        room_amt = b["total_price"]
        total = room_amt + svc_total
        paid_roll = random.random()
        if paid_roll < 0.62:
            inv_status = "PAID"
            paid_at = b["check_out"] + timedelta(hours=random.randint(1, 6))
            pay_method = random.choice(["CASH", "BANK_TRANSFER"])
        elif paid_roll < 0.78:
            inv_status = "PARTIALLY_PAID"
            paid_at = None
            pay_method = random.choice(["CASH", "BANK_TRANSFER"])
        elif paid_roll < 0.88:
            inv_status = "PENDING"
            paid_at = None
            pay_method = random.choice(["CASH", "BANK_TRANSFER"])
        else:
            inv_status = random.choice(["OVERDUE", "PENDING"])
            paid_at = None
            pay_method = "CASH"

        inv_created = b["check_out"] + timedelta(minutes=random.randint(5, 45))
        invoices.append({
            "id": invoice_id,
            "booking_id": b["id"],
            "room_amount": room_amt,
            "service_amount": svc_total,
            "total_price": total,
            "status": inv_status,
            "pay_method": pay_method,
            "paid_at": paid_at,
            "create_at": inv_created,
            "update_at": paid_at or inv_created,
            "note": "Tự động tạo khi check-out",
        })
        invoice_id += 1

    # Active bookings: add service_usage for CHECKED_IN
    for b in bookings:
        if b["status"] != "CHECKED_IN":
            continue
        if random.random() < 0.4:
            svc = random.choice(SERVICES)
            qty = random.randint(1, 2)
            service_rows.append({
                "id": su_id,
                "booking_id": b["id"],
                "service_id": svc["id"],
                "quantity": qty,
                "unit_price": svc["price"],
                "total_price": svc["price"] * qty,
                "use_at": b["check_in"] + timedelta(hours=random.randint(6, 36)),
            })
            su_id += 1

    lines = [
        "-- Seed 1 tháng vận hành (2026-04-15 -> 2026-05-15)",
        "-- Chạy: mysql -u root -p hotel_management < hotel_management_seed_1month.sql",
        "SET NAMES utf8mb4;",
        "SET FOREIGN_KEY_CHECKS = 0;",
        "USE `hotel_management`;",
        "",
        "DELETE FROM `service_usage`;",
        "DELETE FROM `invoices`;",
        "DELETE FROM `bookings`;",
        "",
    ]

    lines.append("INSERT INTO `users` (`id`,`create_at`,`email`,`full_name`,`password`,`phone`,`role`,`status`,`update_at`,`username`,`security_answer_hash`,`security_question`) VALUES")
    user_vals = []
    t0 = "2026-04-10 08:00:00.000000"
    for cid, uname, email, fname, phone in CUSTOMERS:
        user_vals.append(
            f"({cid},'{t0}','{email}','{fname}','{PWD_HASH}','{phone}','CUSTOMER','ACTIVE','{t0}','{uname}',NULL,NULL)"
        )
    lines.append(",\n".join(user_vals) + "\nON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`), `phone`=VALUES(`phone`);\n")

    lines.append("INSERT INTO `bookings` (`id`,`check_in_at`,`check_out_at`,`create_at`,`note`,`room_price`,`status`,`total_price`,`update_at`,`room_id`,`user_id`) VALUES")
    b_vals = []
    for b in bookings:
        note = b["note"].replace("'", "''")
        b_vals.append(
            f"({b['id']},'{dt_str(b['check_in'])}','{dt_str(b['check_out'])}','{dt_str(b['create_at'])}','{note}',"
            f"{b['room_price']},'{b['status']}',{b['total_price']},'{dt_str(b['update_at'])}',{b['room_id']},{b['user_id']})"
        )
    lines.append(",\n".join(b_vals) + ";\n")

    if service_rows:
        lines.append("INSERT INTO `service_usage` (`id`,`quantity`,`total_price`,`unit_price`,`use_at`,`booking_id`,`service_id`) VALUES")
        su_vals = []
        for s in service_rows:
            su_vals.append(
                f"({s['id']},{s['quantity']},{s['total_price']},{s['unit_price']},"
                f"'{dt_str(s['use_at'])}',{s['booking_id']},{s['service_id']})"
            )
        lines.append(",\n".join(su_vals) + ";\n")

    lines.append("INSERT INTO `invoices` (`id`,`create_at`,`note`,`paid_at`,`pay_method`,`room_amount`,`service_amount`,`status`,`total_price`,`update_at`,`booking_id`) VALUES")
    i_vals = []
    for inv in invoices:
        paid = f"'{dt_str(inv['paid_at'])}'" if inv["paid_at"] else "NULL"
        i_vals.append(
            f"({inv['id']},'{dt_str(inv['create_at'])}','{inv['note']}',{paid},'{inv['pay_method']}',"
            f"{inv['room_amount']},{inv['service_amount']},'{inv['status']}',{inv['total_price']},"
            f"'{dt_str(inv['update_at'])}',{inv['booking_id']})"
        )
    lines.append(",\n".join(i_vals) + ";\n")

    # Room status snapshot
    occupied_rooms = {b["room_id"] for b in bookings if b["status"] == "CHECKED_IN"}
    lines.append("UPDATE `rooms` SET `status`='AVAILABLE' WHERE `status`!='MAINTENANCE';")
    for rid in occupied_rooms:
        lines.append(f"UPDATE `rooms` SET `status`='OCCUPIED' WHERE `id`={rid};")
    lines.append("SET FOREIGN_KEY_CHECKS = 1;")
    lines.append(f"-- Bookings: {len(bookings)}, Invoices: {len(invoices)}, Service usage: {len(service_rows)}")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"  bookings={len(bookings)}, invoices={len(invoices)}, service_usage={len(service_rows)}")


if __name__ == "__main__":
    main()
