export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Chính sách bảo mật</h1>
            <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-4">Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}</p>
                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Thông tin thu thập</h2>
                        <p>
                            Chúng tôi thu thập thông tin cá nhân của bạn khi bạn sử dụng dịch vụ của chúng tôi, bao gồm nhưng không giới hạn: tên, địa chỉ email, số điện
                            thoại, và thông tin thanh toán.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Mục đích sử dụng</h2>
                        <p>
                            Thông tin cá nhân của bạn được sử dụng để cung cấp và cải thiện dịch vụ, xử lý đơn hàng, gửi thông báo, và liên lạc với bạn về các vấn đề liên
                            quan đến dịch vụ.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Bảo mật thông tin</h2>
                        <p>
                            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp bảo mật tiên tiến. Tuy nhiên, không có phương thức truyền tải qua
                            Internet hoặc lưu trữ điện tử nào là hoàn toàn an toàn.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Chia sẻ thông tin</h2>
                        <p>
                            Chúng tôi không bán, trao đổi hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba. Chúng tôi chỉ chia sẻ thông tin khi có yêu cầu pháp lý
                            hoặc để bảo vệ quyền lợi của chúng tôi.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Liên hệ</h2>
                        <p>Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua email bên dưới.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
