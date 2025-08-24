// lib/content-detail-limitations.ts
export const detailLimitations = {
  vi: {
    title: "Những hạn chế của cơ chế bao cấp",
    subtitle: "Méo mó quan hệ “giá – lương – tiền”, lạm phát và ách tắc lưu thông",
    sections: [
      {
        heading: "Tổng điều chỉnh 1985 và hệ lụy",
        text: `Tháng 9/1985, thực hiện “tổng điều chỉnh giá – lương – tiền” kèm thu đổi tiền ngày 14/9/1985 (10 đồng cũ đổi 1 đồng mới). 
Mục tiêu chống lạm phát không đạt; giá đầu vào – đầu ra điều chỉnh bất hợp lý làm ngân sách cạn, phải phát hành thêm tiền; 
lạm phát bùng nổ lên ba con số, đỉnh 774,5% năm 1986, đến 1990 mới kéo về hai con số.`,
        source: "Tạp chí Công Thương (tcct), THƯ VIỆN PHÁP LUẬT (QĐ 01-HĐBT-TĐ 13/9/1985)",
      },
      {
        heading: "Mốc đổi tiền 14/9/1985",
        text: `Quyết định 01-HĐBT-TĐ ngày 13/9/1985 quy định phát hành tiền mới và thu đổi tiền cũ, xác nhận mốc đổi tiền 14/9/1985. 
Hình ảnh cuộc thu đổi tiền do TTXVN ghi lại là một tư liệu quan trọng.`,
        source: "THƯ VIỆN PHÁP LUẬT, TTXVN",
      },
      {
        heading: "Khan hiếm kéo dài, phân phối xin-cho",
        text: `Hệ thống tem phiếu phức tạp, nhiều chủng loại, cấp theo tiêu chuẩn và hạn dùng theo tháng; 
ngay cả “có tiền chưa chắc đã mua được”, phản ánh tắc nghẽn lưu thông và thiếu động lực sản xuất.`,
        source: "Bảo tàng Lịch sử Quốc gia",
      },
    ],
    images: [
      { alt: "Cuộc thu đổi tiền 14/9/1985 (TTXVN)", src: "" }, // chèn sau
      { alt: "Xếp hàng mua lương thực thời bao cấp", src: "" }, // chèn sau
    ],
  },

  en: {
    title: "Limitations of the Subsidy Mechanism",
    subtitle: "Distorted price–wage–money relations, inflation, and distribution bottlenecks",
    sections: [
      {
        heading: "1985 General Adjustment and its aftermath",
        text: `In September 1985, the “general adjustment of prices–wages–money” was implemented with a currency exchange on 14/9/1985 (10 old to 1 new). 
The anti-inflation goal failed; misaligned input–output prices depleted the budget, forcing more issuance; 
inflation surged to triple digits, peaking at 774.5% in 1986, only returning to double digits by 1990.`,
        source: "Industry and Trade Review (tcct), LAW LIBRARY of Vietnam (Decision 01-HĐBT-TĐ 13/9/1985)",
      },
      {
        heading: "Currency exchange on 14/9/1985",
        text: `Decision 01-HĐBT-TĐ dated 13/9/1985 mandated issuing new notes and exchanging old ones, confirming the 14/9/1985 milestone. 
Photos by VNA document the event.`,
        source: "LAW LIBRARY of Vietnam, Vietnam News Agency (VNA)",
      },
      {
        heading: "Prolonged shortages and rationing",
        text: `A complex coupon system with multiple categories, quota-based allocation and monthly validity; 
even “having money didn’t guarantee purchase”, reflecting circulation bottlenecks and weak production incentives.`,
        source: "National Museum of History",
      },
    ],
    images: [
      { alt: "Currency exchange on 14/9/1985 (VNA)", src: "" }, // add later
      { alt: "Queues for food during subsidy era", src: "" }, // add later
    ],
  },
}
