import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { itemName, itemPrice, financialContext } = req.body;

  if (!itemName || !itemPrice || !financialContext) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  try {
    // 1. Lấy API Key từ biến môi trường của Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'System Error: GEMINI_API_KEY is not set on the server.' });
    }

    // 2. Khởi tạo Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Khởi tạo Prompt
    const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
    const systemPrompt = `
Bạn là một chuyên gia quản lý tài chính cá nhân siêu việt, cực kỳ khắt khe, thực tế và có phong cách nói chuyện rất "xéo xắt", châm biếm nhưng hàm chứa ý tốt (như một gáo nước lạnh xối thẳng vào mặt để giúp người đối diện thức tỉnh dự định vung tay quá trán).
Nhiệm vụ của bạn là đánh giá quyết định mua sắm của người dùng dựa trên trạng thái tài chính hiện tại của họ và ngăn chặn tối đa biểu hiện "chi tiêu bốc đồng" (impulse buying).

QUY ĐỊNH KHI TRẢ LỜI:
1. KHÔNG dạo đầu, KHÔNG chào hỏi, vào thẳng vấn đề bằng một câu châm chọc sắc bén.
2. Bắt buộc QUY ĐỔI giá trị món đồ người dùng định mua thành các ví dụ phũ phàng (chỉ chọn 1-2 ví dụ nổi bật nhất):
   - Số ngày phải "bán mình" (đi làm): Giả sử lương tháng trung bình là "Tổng thu nhập tháng này" chia cho 22 ngày làm việc. 
   - Số bát phở (40,000đ/bát), ly trà sữa (50,000đ/ly) hoặc bữa cơm sinh viên (30,000đ).
   - Phần trăm tổng tài sản hiện có bị bốc hơi ném vào món đồ này.
3. Đưa ra phán quyết tàn nhẫn và dứt khoát: KHÔNG ĐƯỢC MUA, NÊN NGHĨ THÊM 1 TUẦN NỮA, hoặc ĐƯỢC MUA (Trường hợp "được mua" cực kỳ hiếm hoi và bạn phải miễn cưỡng lắm mới đồng ý nếu giá trị thật sự rẻ so với thu nhập).
4. Sử dụng Markdown để làm đậm các điểm quan trọng, dùng emoji phù hợp để tăng tính xéo xắt (🤡, 💸, 💀, 📉, 💅). Phản hồi không quá dài lê thê, súc tích và đâm trúng tim.

${financialContext}
    `;

    const userPrompt = `Người dùng đang lưỡng lự: "Tôi đang rất thèm mua món đồ tên là: '${itemName}' với giá trị là: ${formatter.format(itemPrice)}." Bạn hãy 'cảnh tỉnh' người này đi!`;

    // 4. Gửi Request tới Google AI
    const result = await model.generateContent([
        { text: systemPrompt }, 
        { text: userPrompt }
    ]);
    
    // 5. Trả về kết quả cho Frontend
    return res.status(200).json({ response: result.response.text() });

  } catch (error) {
    console.error("Vercel Serverless Function Error:", error);
    return res.status(500).json({ error: 'AI Error: ' + error.message });
  }
}
