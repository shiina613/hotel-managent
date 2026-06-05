# Kế hoạch slide báo cáo đồ án tốt nghiệp

## Đề tài

Hệ thống quản lý khách sạn full-stack.

## Số lượng slide đề xuất

Nên làm khoảng **16 slide chính**.

- Nếu thời gian bảo vệ khoảng **10 phút**: rút còn **12-14 slide**.
- Nếu thời gian bảo vệ khoảng **15 phút**: giữ **16-18 slide** và dành **2-4 phút** cho demo.
- Không nên làm quá **20 slide chính**, vì hội đồng thường quan tâm nhất đến: bài toán, kiến trúc, chức năng chạy thực tế, cơ sở dữ liệu, phân quyền và kết quả kiểm thử.

## Hướng trình bày

Không nên bê nguyên cấu trúc báo cáo chương 1, chương 2, chương 3 lên slide. Nên trình bày theo mạch:

**Vấn đề -> Giải pháp -> Hệ thống đã xây dựng -> Kiểm thử -> Kết luận**

## Bố cục 16 slide chính

| Slide | Nội dung | Gợi ý bố cục |
|---|---|---|
| 1 | Trang bìa | Tên đề tài, sinh viên, GVHD, trường/khoa |
| 2 | Lý do chọn đề tài | 3 ý: nhu cầu quản lý khách sạn, hạn chế thủ công, mục tiêu số hóa |
| 3 | Mục tiêu đồ án | Chia 2 cột: mục tiêu nghiệp vụ và mục tiêu kỹ thuật |
| 4 | Phạm vi hệ thống | Các vai trò: Admin, Receptionist, Customer; các module chính |
| 5 | Công nghệ sử dụng | Sơ đồ 3 tầng: React/Vite, Spring Boot, MySQL |
| 6 | Kiến trúc tổng thể | Diagram frontend -> API -> service -> repository -> database |
| 7 | Thiết kế cơ sở dữ liệu | ERD rút gọn: User, Room, RoomType, Booking, Invoice, Service |
| 8 | Phân quyền và bảo mật | JWT, BCrypt, Spring Security, quyền theo role |
| 9 | Phân tích chức năng chính | Sơ đồ use case hoặc bảng nhóm chức năng: quản lý phòng, đặt phòng, dịch vụ, hóa đơn, dashboard |
| 10 | Nghiệp vụ đặt phòng | Flow gọn: khách đặt phòng -> lễ tân xác nhận -> nhận phòng -> trả phòng -> sinh hóa đơn |
| 11 | Ràng buộc nghiệp vụ quan trọng | Tránh đặt trùng phòng, kiểm soát trạng thái booking, tự động tạo hóa đơn khi check-out |
| 12 | Giao diện hệ thống | 3 ảnh màn hình đại diện: trang đặt phòng, trang quản lý booking, dashboard quản trị |
| 13 | Triển khai API và xử lý dữ liệu | Nêu các nhóm API chính, DTO validation, phân trang, xử lý lỗi chuẩn JSON |
| 14 | Kiểm thử và đánh giá | Kiểm thử API, kiểm thử giao diện, kiểm thử phân quyền, kiểm thử các tình huống nghiệp vụ |
| 15 | Kết quả đạt được | Hoàn thành full-stack, phân quyền, dashboard, invoice tự động, UI hoàn chỉnh |
| 16 | Kết luận và hướng phát triển | Kết luận + hướng phát triển: thanh toán online, email, đặt nhiều phòng, deploy production |

## Slide backup

Nên có thêm **3-5 slide backup** để trả lời khi hội đồng hỏi sâu. Không cần trình bày nếu không bị hỏi.

| Backup | Nội dung |
|---|---|
| B1 | Danh sách API endpoint chính |
| B2 | Chi tiết bảng database |
| B3 | Cấu hình triển khai local/VPS |
| B4 | Tài khoản demo |
| B5 | Một số lỗi/validation nghiệp vụ quan trọng |

## Script nói theo từng slide

### Slide 1: Trang bìa

Kính thưa quý thầy cô, em xin trình bày đồ án tốt nghiệp với đề tài **Hệ thống quản lý khách sạn**. Đồ án tập trung xây dựng một hệ thống web full-stack hỗ trợ quản lý phòng, đặt phòng, người dùng, dịch vụ, hóa đơn và thống kê doanh thu.

### Slide 2: Lý do chọn đề tài

Trong hoạt động khách sạn, các nghiệp vụ như quản lý phòng, tiếp nhận đặt phòng, cập nhật trạng thái lưu trú và lập hóa đơn diễn ra thường xuyên. Nếu xử lý thủ công bằng sổ sách hoặc file rời rạc, dữ liệu dễ bị sai lệch, khó tra cứu và khó kiểm soát tình trạng phòng theo thời gian thực. Vì vậy, em chọn đề tài này nhằm xây dựng một hệ thống hỗ trợ số hóa quy trình quản lý khách sạn.

### Slide 3: Mục tiêu đồ án

Mục tiêu của đồ án gồm hai phần. Về nghiệp vụ, hệ thống cần hỗ trợ các chức năng chính như quản lý phòng, đặt phòng, dịch vụ, hóa đơn và thống kê. Về kỹ thuật, hệ thống cần có kiến trúc rõ ràng, phân quyền người dùng, bảo mật đăng nhập, xử lý dữ liệu qua API và giao diện dễ sử dụng.

### Slide 4: Phạm vi hệ thống

Hệ thống được xây dựng cho ba nhóm người dùng chính: quản trị viên, lễ tân và khách hàng. Quản trị viên có quyền quản lý toàn bộ dữ liệu và xem dashboard. Lễ tân xử lý các nghiệp vụ đặt phòng, nhận phòng, trả phòng. Khách hàng có thể xem phòng, đặt phòng và theo dõi thông tin đặt phòng của mình.

### Slide 5: Công nghệ sử dụng

Về công nghệ, frontend được xây dựng bằng React, Vite và Tailwind CSS. Backend sử dụng Spring Boot, Spring Security, JPA/Hibernate và JWT. Cơ sở dữ liệu sử dụng MySQL. Ngoài ra, hệ thống có Swagger/Postman để hỗ trợ kiểm thử API và Recharts để hiển thị biểu đồ thống kê.

### Slide 6: Kiến trúc tổng thể

Kiến trúc hệ thống được chia thành ba phần chính. Phía frontend gửi request thông qua các API. Backend tiếp nhận request tại controller, xử lý nghiệp vụ ở service, truy xuất dữ liệu thông qua repository và lưu trữ trong MySQL. Cách tổ chức này giúp tách biệt giao diện, xử lý nghiệp vụ và dữ liệu, từ đó dễ bảo trì và mở rộng.

### Slide 7: Thiết kế cơ sở dữ liệu

Cơ sở dữ liệu tập trung vào các thực thể chính như User, Room, RoomType, Booking, Invoice và Service. Trong đó, Booking là thực thể trung tâm kết nối giữa khách hàng, phòng và quá trình lưu trú. Invoice được tạo từ thông tin đặt phòng và các dịch vụ phát sinh, giúp hệ thống quản lý được doanh thu và lịch sử thanh toán.

### Slide 8: Phân quyền và bảo mật

Hệ thống sử dụng JWT để xác thực người dùng sau khi đăng nhập. Mật khẩu được mã hóa bằng BCrypt trước khi lưu vào cơ sở dữ liệu. Các API được phân quyền theo vai trò, ví dụ dashboard chỉ dành cho admin, còn các thao tác xác nhận đặt phòng hoặc check-in/check-out dành cho admin và lễ tân. Cách này giúp hạn chế truy cập sai quyền và bảo vệ dữ liệu hệ thống.

### Slide 9: Phân tích chức năng chính

Các chức năng của hệ thống được chia thành các nhóm chính: quản lý người dùng, quản lý phòng và loại phòng, quản lý đặt phòng, quản lý dịch vụ, quản lý hóa đơn và dashboard thống kê. Việc chia nhóm như vậy giúp hệ thống bám sát quy trình vận hành thực tế của khách sạn, đồng thời giúp từng vai trò sử dụng đúng phần việc của mình.

### Slide 10: Nghiệp vụ đặt phòng

Nghiệp vụ đặt phòng là quy trình quan trọng nhất của hệ thống. Khách hàng xem thông tin phòng và gửi yêu cầu đặt phòng. Sau đó lễ tân hoặc admin xác nhận booking, thực hiện check-in khi khách đến, và check-out khi khách trả phòng. Khi check-out, hệ thống có thể sinh hóa đơn dựa trên thông tin đặt phòng và dịch vụ đã sử dụng.

### Slide 11: Ràng buộc nghiệp vụ quan trọng

Để hệ thống hoạt động đúng, một số ràng buộc nghiệp vụ được xử lý ở backend. Thứ nhất là kiểm tra trùng lịch đặt phòng để tránh một phòng bị đặt bởi nhiều khách trong cùng khoảng thời gian. Thứ hai là kiểm soát luồng trạng thái booking, không cho cập nhật trạng thái tùy tiện. Thứ ba là tự động tạo hóa đơn khi hoàn tất quá trình trả phòng, giúp giảm thao tác thủ công cho lễ tân.

### Slide 12: Giao diện hệ thống

Đây là một số giao diện đại diện của hệ thống. Giao diện khách hàng tập trung vào xem phòng và đặt phòng. Giao diện lễ tân tập trung vào quản lý booking và cập nhật trạng thái lưu trú. Giao diện quản trị có dashboard để theo dõi doanh thu, tình trạng đặt phòng và các số liệu tổng quan.

### Slide 13: Triển khai API và xử lý dữ liệu

Backend cung cấp các nhóm API cho xác thực, người dùng, phòng, loại phòng, đặt phòng, dịch vụ, hóa đơn và dashboard. Dữ liệu đầu vào được kiểm tra qua DTO validation, danh sách dữ liệu có phân trang, và lỗi được trả về theo cấu trúc JSON thống nhất. Điều này giúp frontend dễ hiển thị lỗi và giúp quá trình kiểm thử API rõ ràng hơn.

### Slide 14: Kiểm thử và đánh giá

Trong quá trình kiểm thử, em tập trung vào các nhóm chính: kiểm thử API bằng Postman, kiểm thử giao diện, kiểm thử phân quyền theo vai trò và kiểm thử các tình huống nghiệp vụ. Ví dụ, hệ thống cần từ chối đặt phòng bị trùng lịch, không cho người dùng truy cập API sai quyền, và trả về lỗi rõ ràng khi dữ liệu nhập không hợp lệ.

### Slide 15: Kết quả đạt được

Sau quá trình thực hiện, hệ thống đã hoàn thành các chức năng chính của một ứng dụng quản lý khách sạn. Hệ thống có frontend, backend và database hoạt động kết nối với nhau; có đăng nhập, phân quyền, quản lý phòng, đặt phòng, dịch vụ, hóa đơn và dashboard. Ngoài ra, hệ thống cũng xử lý được một số ràng buộc nghiệp vụ quan trọng như trạng thái booking và tạo hóa đơn khi check-out.

### Slide 16: Kết luận và hướng phát triển

Tổng kết lại, đồ án đã xây dựng được một hệ thống quản lý khách sạn có đầy đủ các thành phần cơ bản và có thể mở rộng thêm trong tương lai. Một số hướng phát triển tiếp theo là tích hợp thanh toán online, gửi email xác nhận đặt phòng, hỗ trợ đặt nhiều phòng trong một booking, tối ưu dashboard báo cáo và triển khai hệ thống lên môi trường production ổn định hơn.

## Gợi ý phân bổ thời gian

Với bài thuyết trình 15 phút:

| Phần | Thời gian |
|---|---:|
| Giới thiệu đề tài, lý do, mục tiêu | 2 phút |
| Kiến trúc, công nghệ, database, bảo mật | 4 phút |
| Chức năng chính và quy trình nghiệp vụ | 4 phút |
| Demo hệ thống | 3 phút |
| Kiểm thử, kết quả, kết luận | 2 phút |

## Lưu ý khi làm slide

- Mỗi slide chỉ nên có một thông điệp chính.
- Hạn chế văn bản dài; ưu tiên sơ đồ, ảnh màn hình và flow nghiệp vụ.
- Các slide chức năng nên dùng ảnh chụp màn hình thật của hệ thống.
- Slide cơ sở dữ liệu chỉ cần ERD rút gọn, không đưa toàn bộ bảng và cột lên slide chính.
- Slide API endpoint nên để trong backup, tránh làm bài thuyết trình bị nặng về danh sách.
- Demo nên đi theo một kịch bản rõ: khách đặt phòng -> lễ tân xác nhận/check-in/check-out -> hệ thống sinh hóa đơn -> admin xem dashboard.
