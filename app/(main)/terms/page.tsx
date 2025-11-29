export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Điều khoản sử dụng</h1>
            <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-4">Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}</p>
                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Chấp nhận điều khoản</h2>
                        <p>
                            Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng được nêu trong tài liệu
                            này.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Sử dụng dịch vụ</h2>
                        <p>
                            Bạn được phép sử dụng website này cho mục đích cá nhân và thương mại hợp pháp. Bạn không được sử dụng website này cho bất kỳ mục đích bất hợp
                            pháp nào.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Quyền sở hữu trí tuệ</h2>
                        <p>
                            Tất cả nội dung trên website này, bao gồm nhưng không giới hạn: văn bản, hình ảnh, logo, và phần mềm, đều thuộc quyền sở hữu của VinFast hoặc
                            các đối tác của chúng tôi.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Giới hạn trách nhiệm</h2>
                        <p>
                            VinFast không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng website này, bao gồm nhưng không giới
                            hạn: thiệt hại trực tiếp, gián tiếp, ngẫu nhiên hoặc hậu quả.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Thay đổi điều khoản</h2>
                        <p>
                            Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. Việc tiếp tục sử dụng website sau khi có thay đổi được coi là bạn đã chấp nhận
                            các điều khoản mới.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Liên hệ</h2>
                        <p>Nếu bạn có bất kỳ câu hỏi nào về các điều khoản sử dụng này, vui lòng liên hệ với chúng tôi qua email bên dưới.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
