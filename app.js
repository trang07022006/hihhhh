// ================== 1. STATE TOÀN CỤC CỦA ỨNG DỤNG ==================
const state = {
  totalPoints: 0,
  actionsCount: 0,
  history: [], // mỗi phần tử: {title, points, meta, time}
};

// ================== 2. DỮ LIỆU THỬ THÁCH DEMO ==================
const challenges = [
  {
    id: "plant-tree",
    title: "Trồng 01 cây xanh trong khuôn viên trường",
    description:
      "Chụp ảnh trước & sau khi trồng cây, ghi lại vị trí để bộ phận môi trường xác nhận.",
    impactLevel: "high", // high / medium / low
    impactBase: 3,
    verifyFactor: 1.2,
    challengeFactor: 1.5,
    estimatedMinutes: 60,
  },
  {
    id: "clean-campus",
    title: "Nhặt rác & dọn vệ sinh khu vực xung quanh lớp học",
    description:
      "Thực hiện tối thiểu 30 phút, phân loại rác vô cơ/hữu cơ.",
    impactLevel: "medium",
    impactBase: 2,
    verifyFactor: 1.2,
    challengeFactor: 1.3,
    estimatedMinutes: 30,
  },
  {
    id: "recycle-bottles",
    title: "Mang tối thiểu 10 chai nhựa đến điểm tái chế",
    description: "Check-in tại điểm thu gom rác tái chế của trường.",
    impactLevel: "medium",
    impactBase: 2,
    verifyFactor: 1.1,
    challengeFactor: 1.2,
    estimatedMinutes: 20,
  },
  {
    id: "paper-day",
    title: "Một ngày chỉ sử dụng đồ giấy thân thiện môi trường",
    description: "Không dùng túi nilon/ly nhựa trong vòng 24h.",
    impactLevel: "high",
    impactBase: 3,
    verifyFactor: 1.0,
    challengeFactor: 1.4,
    estimatedMinutes: 1440,
  },
  {
    id: "share-post",
    title: "Chia sẻ bài viết về bảo vệ môi trường lên mạng xã hội",
    description: "Viết caption riêng và gắn hashtag của chiến dịch.",
    impactLevel: "low",
    impactBase: 1,
    verifyFactor: 1.0,
    challengeFactor: 1.1,
    estimatedMinutes: 10,
  },
  {
    id: "bike-to-school",
    title: "Đi bộ / xe đạp đến trường thay vì dùng xe máy",
    description: "Áp dụng cho quãng đường dưới 3 km.",
    impactLevel: "medium",
    impactBase: 2,
    verifyFactor: 1.0,
    challengeFactor: 1.3,
    estimatedMinutes: 40,
  },
  {
    id: "water-saving",
    title: "Kiểm tra & báo cáo điểm rò rỉ nước trong ký túc xá",
    description: "Chụp hình vị trí rò rỉ & gửi cho ban quản lý.",
    impactLevel: "high",
    impactBase: 3,
    verifyFactor: 1.1,
    challengeFactor: 1.2,
    estimatedMinutes: 25,
  },
  {
    id: "eco-workshop",
    title: "Tham gia workshop / talkshow về phát triển bền vững",
    description: "Điểm cộng thêm nếu đặt câu hỏi cho diễn giả.",
    impactLevel: "high",
    impactBase: 3,
    verifyFactor: 1.3,
    challengeFactor: 1.5,
    estimatedMinutes: 90,
  },
];

// ================== 3. DỮ LIỆU QUÀ TẶNG DEMO ==================
const rewards = [
  {
    id: "coffee-10k",
    title: "Voucher giảm 10.000đ tại Eco Coffee",
    description: "Áp dụng cho đồ uống mang ly cá nhân.",
    category: "Đồ uống",
    pointsRequired: 40,
    partner: "Eco Coffee – Khu A",
  },
  {
    id: "tote-bag",
    title: "Túi vải tote thân thiện môi trường",
    description: "Thiết kế logo 'Green Campus'.",
    category: "Đồ dùng",
    pointsRequired: 80,
    partner: "CLB Môi trường",
  },
  {
    id: "ebook",
    title: "Ebook miễn phí về Kinh tế xanh",
    description: "Tài liệu tham khảo cho sinh viên kinh tế.",
    category: "Học tập",
    pointsRequired: 25,
    partner: "Thư viện số trường",
  },
  {
    id: "lunch-voucher",
    title: "Voucher 20.000đ tại căn tin xanh",
    description: "Khuyến khích mang hộp cá nhân.",
    category: "Ăn uống",
    pointsRequired: 60,
    partner: "Căn tin khu B",
  },
  {
    id: "tree-sponsor",
    title: "Tài trợ trồng 01 cây ghi tên bạn",
    description: "Tên bạn sẽ xuất hiện trên bản đồ cây xanh.",
    category: "Tác động xã hội",
    pointsRequired: 120,
    partner: "Phòng Công tác Sinh viên",
  },
];

// ================== 4. HÀM TIỆN ÍCH ==================
function formatPoints(points) {
  return Math.round(points);
}

function getLevelName(points) {
  if (points >= 200) return "Legendary 🌎";
  if (points >= 120) return "Hero 🌿";
  if (points >= 60) return "Advancer 🍀";
  if (points >= 30) return "Explorer 🌱";
  return "Rookie 🌱";
}

function nextLevelThreshold(points) {
  if (points < 30) return 30;
  if (points < 60) return 60;
  if (points < 120) return 120;
  if (points < 200) return 200;
  return null;
}

// ================== 5. RENDER UI CHÍNH ==================
const challengeListEl = document.getElementById("challengeList");
const historyListEl = document.getElementById("historyList");
const walletTotalEl = document.getElementById("walletTotal");
const walletLevelEl = document.getElementById("walletLevel");
const walletNextLevelTextEl = document.getElementById("walletNextLevelText");
const walletActionsCountEl = document.getElementById("walletActionsCount");
const rewardGridEl = document.getElementById("rewardGrid");
const rewardsMsgEl = document.getElementById("rewardsMsg");
const aiLogEl = document.getElementById("aiLog");

// --- Render danh sách thử thách ---
function renderChallenges(filterLevel = "all") {
  challengeListEl.innerHTML = "";
  const filtered = challenges.filter(ch =>
    filterLevel === "all" ? true : ch.impactLevel === filterLevel
  );

  filtered.forEach(ch => {
    const pointsPreview = formatPoints(
      ch.impactBase * ch.verifyFactor * ch.challengeFactor
    );

    const item = document.createElement("div");
    item.className = "challenge-item";
    item.innerHTML = `
      <div>
        <div class="challenge-title">${ch.title}</div>
        <div class="challenge-meta">
          <span class="badge-level ${ch.impactLevel}">
            ${
              ch.impactLevel === "high"
                ? "Tác động cao"
                : ch.impactLevel === "medium"
                ? "Tác động trung bình"
                : "Tác động thấp"
            }
          </span>
          <span>Mức độ: ${ch.impactBase}</span>
          <span>Hệ số xác thực: ${ch.verifyFactor}</span>
          <span>Hệ số thử thách: ${ch.challengeFactor}</span>
          <span>~${ch.estimatedMinutes} phút</span>
        </div>
        <div style="font-size:12px;color:var(--text-muted);">
          ${ch.description}
        </div>
      </div>
      <div class="challenge-actions">
        <div class="points-tag">+${pointsPreview} EP (ước tính)</div>
        <button class="btn btn-primary" data-complete-id="${ch.id}">
          ✅ Đã hoàn thành
        </button>
        <button class="btn btn-outline" data-join-id="${ch.id}">
          📌 Lưu vào kế hoạch
        </button>
      </div>
    `;
    challengeListEl.appendChild(item);
  });
}

// --- Render ví & lịch sử ---
function renderWallet() {
  walletTotalEl.textContent = formatPoints(state.totalPoints);
  walletActionsCountEl.textContent = state.actionsCount;

  const levelName = getLevelName(state.totalPoints);
  walletLevelEl.textContent = levelName;

  const next = nextLevelThreshold(state.totalPoints);
  if (next === null) {
    walletNextLevelTextEl.textContent =
      "Bạn đã đạt cấp cao nhất trong demo 🎉";
  } else {
    const remain = next - state.totalPoints;
    walletNextLevelTextEl.textContent =
      formatPoints(state.totalPoints) +
      " / " +
      next +
      " điểm • còn " +
      formatPoints(remain) +
      " EP để lên cấp tiếp theo";
  }

  historyListEl.innerHTML = "";
  if (state.history.length === 0) {
    historyListEl.innerHTML =
      '<div class="history-item"><div class="history-title">Chưa có hoạt động nào</div><div class="history-meta">Hoàn thành thử thách ở tab "Thử thách xanh" để bắt đầu tích điểm.</div></div>';
    return;
  }

  state.history
    .slice()
    .reverse()
    .forEach(item => {
      const li = document.createElement("div");
      li.className = "history-item";
      li.innerHTML = `
        <div>
          <div class="history-title">${item.title}</div>
          <div class="history-meta">${item.meta}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:600;color:var(--accent);">
            +${formatPoints(item.points)} EP
          </div>
          <div class="history-meta">${item.time}</div>
        </div>
      `;
      historyListEl.appendChild(li);
    });
}

// --- Render danh sách quà tặng ---
function renderRewards() {
  rewardGridEl.innerHTML = "";
  rewards.forEach(r => {
    const item = document.createElement("div");
    item.className = "reward-item";
    item.innerHTML = `
      <div class="reward-title">${r.title}</div>
      <div style="font-size:12px;color:var(--text-muted);">
        ${r.description}
      </div>
      <div style="margin-top:4px;">
        <span class="reward-tag">${r.category}</span>
        <span class="reward-tag">Đối tác: ${r.partner}</span>
      </div>
      <div class="reward-footer">
        <div class="reward-points">Yêu cầu: ${r.pointsRequired} EP</div>
        <button class="btn btn-primary" data-redeem-id="${r.id}">
          🎁 Đổi thưởng
        </button>
      </div>
    `;
    rewardGridEl.appendChild(item);
  });
}

// ================== 6. XỬ LÝ SỰ KIỆN ==================

// --- Chuyển tab ---
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-tab-target");

    document
      .querySelectorAll(".tab-btn")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document
      .querySelectorAll(".tab-content")
      .forEach(tab => tab.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

// --- Lọc thử thách theo mức độ ---
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document
      .querySelectorAll(".chip")
      .forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    renderChallenges(chip.getAttribute("data-filter"));
  });
});

// --- Xử lý nút hoàn thành thử thách & lưu kế hoạch ---
challengeListEl.addEventListener("click", e => {
  const completeId = e.target.getAttribute("data-complete-id");
  const joinId = e.target.getAttribute("data-join-id");

  if (completeId) {
    handleCompleteChallenge(completeId);
  } else if (joinId) {
    const ch = challenges.find(c => c.id === joinId);
    if (!ch) return;
    addAiMessage(
      '📌 Đã lưu thử thách "' +
        ch.title +
        '" vào kế hoạch cá nhân (demo). Bạn có thể bổ sung calendar / thông báo push ở bản thật.'
    );
  }
});

// --- Hoàn thành thử thách: cập nhật điểm & lịch sử ---
function handleCompleteChallenge(id) {
  const ch = challenges.find(c => c.id === id);
  if (!ch) return;

  const points = ch.impactBase * ch.verifyFactor * ch.challengeFactor;

  state.totalPoints += points;
  state.actionsCount += 1;

  const now = new Date();
  const timeStr =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  state.history.push({
    title: ch.title,
    points,
    meta:
      "Mức độ " +
      ch.impactBase +
      " • Xác thực " +
      ch.verifyFactor +
      " • Thử thách " +
      ch.challengeFactor,
    time: timeStr,
  });

  renderWallet();

  addAiMessage(
    "✅ Ghi nhận: \"" +
      ch.title +
      '" • +' +
      formatPoints(points) +
      " EP. Gợi ý: bạn có thể ghép thử thách này với một chiến dịch truyền thông nhỏ trên mạng xã hội."
  );
}

// --- Xử lý đổi thưởng ---
rewardGridEl.addEventListener("click", e => {
  const id = e.target.getAttribute("data-redeem-id");
  if (!id) return;

  const reward = rewards.find(r => r.id === id);
  if (!reward) return;

  const cost = reward.pointsRequired;
  if (state.totalPoints < cost) {
    rewardsMsgEl.textContent =
      '❌ Bạn chưa đủ điểm để đổi "' +
      reward.title +
      '". Cần thêm ' +
      (cost - formatPoints(state.totalPoints)) +
      " EP.";
    rewardsMsgEl.className = "msg error";
    return;
  }

  state.totalPoints -= cost;
  renderWallet();

  rewardsMsgEl.textContent =
    '🎉 Đổi thưởng thành công: "' +
    reward.title +
    '". (Demo: trong bản thật sẽ tạo QR / mã voucher để quét tại đối tác.)';
  rewardsMsgEl.className = "msg success";

  addAiMessage(
    '🎁 Bạn vừa đổi "' +
      reward.title +
      '". Gợi ý: có thể gửi email cảm ơn đối tác, ghi nhận đóng góp của họ trong báo cáo ESG của trường.'
  );
});

// --- Nút reset demo ---
document.getElementById("btnResetDemo").addEventListener("click", () => {
  state.totalPoints = 0;
  state.actionsCount = 0;
  state.history = [];
  renderWallet();
  rewardsMsgEl.textContent = "";
  rewardsMsgEl.className = "msg";

  addAiMessage("🔄 Đã reset dữ liệu demo. Bạn có thể bắt đầu thử thách lại từ đầu.");
});

// --- Nút AI gợi ý thử thách ngẫu nhiên ---
document.getElementById("btnSuggest").addEventListener("click", () => {
  const random = challenges[Math.floor(Math.random() * challenges.length)];
  addAiMessage(
    "🤖 Gợi ý hôm nay: \"" +
      random.title +
      "\" (" +
      (random.impactLevel === "high"
        ? "tác động cao"
        : random.impactLevel === "medium"
        ? "tác động trung bình"
        : "tác động thấp") +
      ").\nBạn có thể kết hợp hoạt động này với việc thu thập số liệu (ảnh, số lượng rác, số cây trồng…) để báo cáo định lượng trong môn học."
  );
});

// --- AI input demo (không gọi API thật) ---
document.getElementById("aiSend").addEventListener("click", handleAiInput);
document.getElementById("aiInput").addEventListener("keydown", e => {
  if (e.key === "Enter") handleAiInput();
});

function handleAiInput() {
  const input = document.getElementById("aiInput");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  addAiMessage("👤 Bạn: " + text);

  let reply =
    '🤖 Gợi ý chung: Bạn có thể thiết kế một mini-campaign xoay quanh chủ đề "' +
    text +
    '" với 1 thử thách offline + 1 thử thách online (share bài viết / infographic).';

  const lower = text.toLowerCase();
  if (lower.includes("rác") || lower.includes("nhựa")) {
    reply =
      "♻ Chủ đề rác thải/nhựa: hãy thử tạo 'Tuần lễ không nhựa dùng một lần', mỗi ngày 1 thử thách nhỏ (mang bình nước cá nhân, từ chối ống hút nhựa, gom chai nhựa về điểm tái chế...). Mỗi hành động gắn 1 Ecopoint khác nhau.";
  } else if (lower.includes("cây") || lower.includes("trồng")) {
    reply =
      "🌳 Chủ đề cây xanh: bạn có thể lập 'Bản đồ cây xanh của trường', mỗi cây được gắn QR để sinh viên quét nhận điểm và xem thông tin về loài cây đó.";
  } else if (lower.includes("nước")) {
    reply =
      "💧 Chủ đề tiết kiệm nước: gợi ý tạo form/report để sinh viên báo cáo điểm rò rỉ nước, sau đó phòng quản trị xử lý. Mỗi báo cáo hợp lệ được cộng Ecopoint.";
  }

  addAiMessage(reply);
}

// --- Thêm message vào AI panel ---
function addAiMessage(text) {
  const div = document.createElement("div");
  div.className = "ai-message";
  div.textContent = text;
  aiLogEl.appendChild(div);
  aiLogEl.scrollTop = aiLogEl.scrollHeight;
}

// ================== 7. KHỞI TẠO APP LẦN ĐẦU ==================
function init() {
  renderChallenges();
  renderWallet();
  renderRewards();
}

init();
