const STORAGE_PREFIX = "student-wellness:";
const ACCOUNT_PREFIX = "student-wellness-account:";

const loginScreen = document.querySelector("#loginScreen");
const loginForm = document.querySelector("#loginForm");
const loginName = document.querySelector("#loginName");
const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");
const loginConfirmPassword = document.querySelector("#loginConfirmPassword");
const loginError = document.querySelector("#loginError");
const accessTitle = document.querySelector("#accessTitle");
const signInTab = document.querySelector("#signInTab");
const signUpTab = document.querySelector("#signUpTab");
const loginSubmit = document.querySelector("#loginSubmit");
const signupOnlyFields = [...document.querySelectorAll(".signup-only")];
const activeStudentId = document.querySelector("#activeStudentId");
const logoutButton = document.querySelector("#logoutButton");
const form = document.querySelector("#assessmentForm");
let currentStudentId = "";
let authMode = "signin";

const fields = {
  name: document.querySelector("#studentName"),
  location: document.querySelector("#studentLocation"),
  stressQuestions: [...document.querySelectorAll(".stress-question")],
  sleep: document.querySelector("#sleep"),
  study: document.querySelector("#study"),
  totalClasses: document.querySelector("#totalClasses"),
  attendedClasses: document.querySelector("#attendedClasses"),
  notes: document.querySelector("#notes"),
};

const outputs = {
  stabilityScore: document.querySelector("#stabilityScore"),
  riskBand: document.querySelector("#riskBand"),
  studentTitle: document.querySelector("#studentTitle"),
  stressValue: document.querySelector("#stressValue"),
  sleepValue: document.querySelector("#sleepValue"),
  studyValue: document.querySelector("#studyValue"),
  attendanceRate: document.querySelector("#attendanceRate"),
  burnoutStatus: document.querySelector("#burnoutStatus"),
  stressStatus: document.querySelector("#stressStatus"),
  sleepStatus: document.querySelector("#sleepStatus"),
  attendanceStatus: document.querySelector("#attendanceStatus"),
  riskList: document.querySelector("#riskList"),
  suggestionList: document.querySelector("#suggestionList"),
  planList: document.querySelector("#planList"),
  alertBox: document.querySelector("#alertBox"),
  counselorPanel: document.querySelector("#counselorPanel"),
  counselorTitle: document.querySelector("#counselorTitle"),
  counselorSummary: document.querySelector("#counselorSummary"),
  counselorList: document.querySelector("#counselorList"),
};

const counselorDirectory = [
  {
    name: "Dr. Kavya Reddy",
    area: "Tirupati",
    cities: ["tirupati", "renigunta", "chandragiri"],
    mode: "Student counselling",
    focus: "Exam anxiety, academic pressure, emotional check-ins",
    contact: "kavya.reddy.care@example.com",
  },
  {
    name: "Mr. Arjun Rao",
    area: "Tirupati",
    cities: ["tirupati", "renigunta", "chandragiri"],
    mode: "Academic wellness coach",
    focus: "Study routine planning, burnout prevention, attendance recovery",
    contact: "arjun.rao.wellness@example.com",
  },
  {
    name: "Ms. Nisha Varma",
    area: "Tirupati",
    cities: ["tirupati", "renigunta", "chandragiri"],
    mode: "Online and local referral",
    focus: "Stress overload, sleep imbalance, productivity recovery",
    contact: "nisha.varma.support@example.com",
  },
  {
    name: "Mr. Rohan Iyer",
    area: "Chennai",
    cities: ["chennai"],
    mode: "Academic wellness coach",
    focus: "Burnout, exam anxiety, sleep routine planning",
    contact: "rohan.iyer.support@example.com",
  },
  {
    name: "Dr. Asha Menon",
    area: "Chennai",
    cities: ["chennai"],
    mode: "Student counselling",
    focus: "Academic stress, attendance concerns, adjustment issues",
    contact: "asha.menon.wellness@example.com",
  },
  {
    name: "Ms. Meera Krishnan",
    area: "Chennai",
    cities: ["chennai"],
    mode: "Online counselling",
    focus: "Emotional regulation, peer pressure, study overload",
    contact: "meera.krishnan.care@example.com",
  },
  {
    name: "Ms. Priya Nair",
    area: "Bengaluru",
    cities: ["bengaluru", "bangalore"],
    mode: "Online counselling",
    focus: "Study overload, emotional regulation, productivity recovery",
    contact: "priya.nair.care@example.com",
  },
  {
    name: "Mr. Dev Sharma",
    area: "Bengaluru",
    cities: ["bengaluru", "bangalore"],
    mode: "Student wellness mentor",
    focus: "Burnout prevention, schedule balance, motivation",
    contact: "dev.sharma.wellness@example.com",
  },
  {
    name: "Dr. Latha Rao",
    area: "Bengaluru",
    cities: ["bengaluru", "bangalore"],
    mode: "Counselling psychologist",
    focus: "Anxiety, sleep routine, academic stress",
    contact: "latha.rao.care@example.com",
  },
  {
    name: "Saarthi Youth Support",
    area: "Mumbai",
    cities: ["mumbai", "thane", "pune", "navi mumbai"],
    mode: "Online and clinic visit",
    focus: "Stress overload, family pressure, academic stability",
    contact: "saarthi-youth@example.com",
  },
  {
    name: "Dr. Riya Kapoor",
    area: "Mumbai",
    cities: ["mumbai", "thane", "pune", "navi mumbai"],
    mode: "Student counselling",
    focus: "Exam pressure, mood support, stress regulation",
    contact: "riya.kapoor.care@example.com",
  },
  {
    name: "Mr. Kabir Desai",
    area: "Mumbai",
    cities: ["mumbai", "thane", "pune", "navi mumbai"],
    mode: "Academic wellness coach",
    focus: "Backlog recovery, attendance planning, burnout risk",
    contact: "kabir.desai.support@example.com",
  },
];

function storageKey(studentId) {
  return `${STORAGE_PREFIX}${studentId}`;
}

function accountKey(email) {
  return `${ACCOUNT_PREFIX}${email}`;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function saveAccount(name, email, password) {
  localStorage.setItem(
    accountKey(email),
    JSON.stringify({
      name,
      email,
      password,
      savedAt: new Date().toISOString(),
    })
  );
}

function getAccount(email) {
  const saved = localStorage.getItem(accountKey(email));
  return saved ? JSON.parse(saved) : null;
}

function setAuthMode(mode) {
  authMode = mode;
  const isSignUp = mode === "signup";
  accessTitle.textContent = isSignUp ? "Create Account" : "Welcome Back";
  loginSubmit.textContent = isSignUp ? "Sign up" : "Sign in";
  signInTab.classList.toggle("active", !isSignUp);
  signUpTab.classList.toggle("active", isSignUp);
  signupOnlyFields.forEach((field) => {
    field.classList.toggle("hidden", !isSignUp);
  });
  loginName.required = isSignUp;
  loginConfirmPassword.required = isSignUp;
  loginPassword.autocomplete = isSignUp ? "new-password" : "current-password";
  loginError.textContent = "";
}

function getFormData() {
  return {
    name: fields.name.value.trim(),
    location: fields.location.value.trim(),
    stressAnswers: fields.stressQuestions.map((field) => field.value),
    sleep: fields.sleep.value,
    study: fields.study.value,
    totalClasses: fields.totalClasses.value,
    attendedClasses: fields.attendedClasses.value,
    notes: fields.notes.value,
    savedAt: new Date().toISOString(),
  };
}

function saveCurrentStudent() {
  if (!currentStudentId) {
    return;
  }

  localStorage.setItem(storageKey(currentStudentId), JSON.stringify(getFormData()));
}

function resetForm() {
  fields.name.value = "";
  fields.location.value = "";
  fields.stressQuestions.forEach((field) => {
    field.value = "0";
  });
  fields.sleep.value = "7";
  fields.study.value = "4";
  fields.totalClasses.value = "";
  fields.attendedClasses.value = "";
  fields.notes.value = "";
}

function hasCheckInInput() {
  const stressRaw = fields.stressQuestions.reduce((sum, field) => sum + Number(field.value), 0);
  return Boolean(
    fields.name.value.trim()
      || fields.notes.value.trim()
      || fields.location.value.trim()
      || fields.totalClasses.value
      || fields.attendedClasses.value
      || stressRaw > 0
      || fields.sleep.value !== "7"
      || fields.study.value !== "4"
  );
}

function loadStudent(studentId, profileName = "") {
  resetForm();
  const saved = localStorage.getItem(storageKey(studentId));

  if (saved) {
    const data = JSON.parse(saved);
    fields.name.value = data.name || "";
    fields.location.value = data.location || "";
    fields.stressQuestions.forEach((field, index) => {
      field.value = data.stressAnswers?.[index] || "0";
    });
    fields.sleep.value = data.sleep || "7";
    fields.study.value = data.study || "4";
    fields.totalClasses.value = data.totalClasses || "";
    fields.attendedClasses.value = data.attendedClasses || "";
    fields.notes.value = data.notes || "";
  }

  currentStudentId = studentId;
  activeStudentId.textContent = studentId;
  if (!fields.name.value && profileName) {
    fields.name.value = profileName;
  }
  loginScreen.classList.add("hidden");

  if (saved || hasCheckInInput()) {
    analyze();
  } else {
    setInitialState();
    outputs.studentTitle.textContent = `Student ${studentId}`;
  }
}

function calculateStress() {
  const total = fields.stressQuestions.reduce((sum, field) => sum + Number(field.value), 0);
  const estimatedStress = Math.round(1 + (total / 15) * 9);
  return {
    score: estimatedStress,
    raw: total,
  };
}

function calculateAttendance() {
  const total = Number(fields.totalClasses.value);
  const attended = Number(fields.attendedClasses.value);

  if (!total || total < 1) {
    return {
      status: "unknown",
      label: "--",
      percent: null,
      attended: 0,
      total: 0,
    };
  }

  const safeAttended = Math.max(0, Math.min(attended, total));
  const percent = Math.round((safeAttended / total) * 100);
  let status = "stable";

  if (percent < 75) {
    status = "critical";
  } else if (percent < 85) {
    status = "slipping";
  }

  return {
    status,
    label: `${safeAttended}/${total} classes (${percent}%)`,
    percent,
    attended: safeAttended,
    total,
  };
}

function listItems(target, items) {
  target.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    target.appendChild(li);
  });
}

function clearCounselorRecommendations() {
  outputs.counselorPanel.classList.remove("hidden");
  outputs.counselorTitle.textContent = "Counselor recommendations";
  outputs.counselorSummary.textContent =
    "Complete the check-in to see whether counselor support is recommended.";
  outputs.counselorList.innerHTML = "";
}

function findCounselors(location) {
  const normalizedLocation = location.trim().toLowerCase();
  if (!normalizedLocation) {
    return [];
  }

  const matches = counselorDirectory.filter((counselor) =>
    counselor.cities.some((city) => normalizedLocation.includes(city))
  );

  return [...new Map(matches.map((counselor) => [counselor.name, counselor])).values()].slice(0, 3);
}

function renderCounselorRecommendations(stability, stress, attendance, emotionalRisk) {
  const needsImmediateSupport = stability < 45 || emotionalRisk;
  const couldUseSupport = stability < 75 || stress >= 6 || attendance.status === "slipping";

  const counselors = findCounselors(fields.location.value);
  outputs.counselorPanel.classList.remove("hidden");
  outputs.counselorTitle.textContent = needsImmediateSupport
    ? "Recommended counselor support"
    : couldUseSupport
      ? "Optional support matches"
      : "Suggested wellness contacts";
  outputs.counselorList.innerHTML = "";
  const location = fields.location.value.trim();

  if (!location) {
    outputs.counselorSummary.textContent = "Add city or nearby area to show counsellors from the student's town.";
    return;
  }

  if (!counselors.length) {
    outputs.counselorSummary.textContent = `No demo counsellors are listed for ${location} yet. Use local search to find support in the student's town.`;
    const card = document.createElement("article");
    card.className = "counselor-card";
    card.innerHTML = `
      <strong>Find local counsellors in ${location}</strong>
      <span>Town-based search | Student support</span>
      <p>Search nearby counsellors or campus wellness support in the student's own area.</p>
      <div class="counselor-actions">
        <a href="https://www.google.com/search?q=${encodeURIComponent(`${location} student counsellor near me`)}" target="_blank" rel="noreferrer">Search nearby</a>
      </div>
    `;
    outputs.counselorList.appendChild(card);
    return;
  }

  outputs.counselorSummary.textContent = `Showing ${counselors.length} demo counsellor recommendations from ${location}. Verify real availability before contacting.`;
  counselors.forEach((counselor) => {
    const card = document.createElement("article");
    card.className = "counselor-card";
    const contactLink = counselor.contact.includes("@")
      ? `mailto:${counselor.contact}`
      : `https://www.google.com/search?q=${encodeURIComponent(counselor.contact)}`;

    card.innerHTML = `
      <strong>${counselor.name}</strong>
      <span>${counselor.area} | ${counselor.mode}</span>
      <p>${counselor.focus}</p>
      <div class="counselor-actions">
        <a href="${contactLink}" target="_blank" rel="noreferrer">${counselor.contact.includes("@") ? "Email" : "Referral info"}</a>
        <a href="https://www.google.com/search?q=${encodeURIComponent(`${counselor.area} student counsellor near me`)}" target="_blank" rel="noreferrer">Search nearby</a>
      </div>
    `;
    outputs.counselorList.appendChild(card);
  });
}

function setInitialState() {
  outputs.stressValue.textContent = "Estimated stress: --/10";
  outputs.sleepValue.textContent = `${fields.sleep.value} hrs`;
  outputs.studyValue.textContent = `${fields.study.value} hrs`;
  outputs.attendanceRate.textContent = "Attendance: --";
  outputs.stabilityScore.textContent = "--";
  outputs.riskBand.className = "risk-band";
  outputs.riskBand.textContent = "Awaiting Check-In";
  outputs.studentTitle.textContent = "No student selected";
  outputs.burnoutStatus.textContent = "--";
  outputs.stressStatus.textContent = "--";
  outputs.sleepStatus.textContent = "--";
  outputs.attendanceStatus.textContent = "--";
  listItems(outputs.riskList, ["Complete the check-in to detect wellness and academic risk indicators."]);
  listItems(outputs.suggestionList, ["Suggestions will appear after analysis."]);
  listItems(outputs.planList, ["Recovery plan will appear after analysis."]);
  outputs.alertBox.classList.remove("urgent");
  outputs.alertBox.textContent = "Complete the check-in to generate counselor alert guidance.";
  clearCounselorRecommendations();
}

function analyze() {
  const stressResult = calculateStress();
  const stress = stressResult.score;
  const sleep = Number(fields.sleep.value);
  const study = Number(fields.study.value);
  const attendance = calculateAttendance();
  const notes = fields.notes.value.toLowerCase();

  outputs.stressValue.textContent = `Estimated stress: ${stress}/10`;
  outputs.sleepValue.textContent = `${sleep} hrs`;
  outputs.studyValue.textContent = `${study} hrs`;
  outputs.attendanceRate.textContent = `Attendance: ${attendance.label}`;
  outputs.studentTitle.textContent = fields.name.value.trim() || "Student";

  let risk = 0;
  const risks = [];
  const suggestions = [];
  const plan = [];

  if (stress >= 8) {
    risk += 28;
    risks.push("Stress overload: stress questionnaire indicates high pressure and reduced recovery capacity.");
    suggestions.push("Move one deadline or task to a lighter day and add a 20-minute decompression block.");
  } else if (stress >= 6) {
    risk += 18;
    risks.push("Stress is trending above a healthy baseline.");
    suggestions.push("Use a short prioritization session to separate urgent work from low-value tasks.");
  }

  if (sleep < 6) {
    risk += 24;
    risks.push("Sleep imbalance: recovery time is below the recommended student baseline.");
    suggestions.push("Set a fixed sleep window tonight and stop study work 45 minutes before bed.");
  } else if (sleep < 7) {
    risk += 12;
    risks.push("Sleep is slightly low and may reduce memory retention.");
  }

  if (study >= 10) {
    risk += 22;
    risks.push("Unhealthy study pattern: long study load may increase burnout risk.");
    suggestions.push("Split study blocks into 50-minute sessions with real breaks and one no-study meal.");
  } else if (study >= 8) {
    risk += 12;
    risks.push("Study load is heavy and needs balancing.");
  }

  if (attendance.status === "critical") {
    risk += 24;
    risks.push(`Attendance decline has reached escalation level: ${attendance.label}.`);
    suggestions.push("Notify mentor or counselor and check whether missed classes are avoidable or health-related.");
  } else if (attendance.status === "slipping") {
    risk += 14;
    risks.push(`Attendance decline is emerging: ${attendance.label}.`);
    suggestions.push("Schedule a low-pressure check-in and identify the classes most at risk.");
  }

  const emotionalRisk =
    notes.includes("drained") || notes.includes("hopeless") || notes.includes("panic") || notes.includes("alone");

  if (emotionalRisk) {
    risk += 18;
    risks.push("Emotional risk indicator detected in mood notes.");
    suggestions.push("Offer a supportive check-in and provide access to campus wellness resources.");
  }

  if (!risks.length) {
    risks.push("No major risk indicators detected today.");
    suggestions.push("Maintain current routine and repeat the check-in tomorrow.");
  }

  plan.push("Pick the top two academic tasks and postpone or delegate nonessential work.");
  plan.push("Protect sleep first, then schedule study in shorter focused blocks.");
  plan.push("Review attendance and backlog with a mentor within the next school day.");

  const stability = Math.max(0, Math.min(100, 100 - risk));
  outputs.stabilityScore.textContent = stability;

  outputs.riskBand.className = "risk-band";
  if (stability >= 75) {
    outputs.riskBand.textContent = "Stable";
    outputs.riskBand.classList.add("low");
  } else if (stability >= 45) {
    outputs.riskBand.textContent = "Moderate Watch";
    outputs.riskBand.classList.add("moderate");
  } else {
    outputs.riskBand.textContent = "High Risk";
    outputs.riskBand.classList.add("high");
  }

  outputs.burnoutStatus.textContent = study >= 8 && stress >= 6 ? "Elevated" : "Controlled";
  outputs.stressStatus.textContent = stress >= 8 ? "High" : stress >= 6 ? "Moderate" : "Low";
  outputs.sleepStatus.textContent = sleep < 6 ? "Imbalanced" : sleep < 7 ? "Watch" : "Healthy";
  outputs.attendanceStatus.textContent =
    attendance.status === "unknown"
      ? "--"
      : attendance.status === "critical"
        ? `Critical (${attendance.percent}%)`
        : attendance.status === "slipping"
          ? `Watch (${attendance.percent}%)`
          : `Stable (${attendance.percent}%)`;

  listItems(outputs.riskList, risks);
  listItems(outputs.suggestionList, suggestions);
  listItems(outputs.planList, plan);

  outputs.alertBox.classList.toggle("urgent", stability < 45);
  outputs.alertBox.textContent =
    stability < 45
      ? "Counselor alert: immediate support check-in recommended."
      : "Counselor alert: monitor for 48 hours before escalation.";

  renderCounselorRecommendations(stability, stress, attendance, emotionalRisk);

  saveCurrentStudent();
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = loginName.value.trim();
  const email = normalizeEmail(loginEmail.value);
  const password = loginPassword.value;
  const confirmPassword = loginConfirmPassword.value;

  loginError.textContent = "";

  if (!email || !password) {
    loginError.textContent = "Please enter email and password.";
    return;
  }

  if (password.length < 6) {
    loginError.textContent = "Password must be at least 6 characters.";
    return;
  }

  if (authMode === "signin") {
    const account = getAccount(email);
    if (!account) {
      loginError.textContent = "No account found. Please sign up first.";
      return;
    }

    if (account.password !== password) {
      loginError.textContent = "Incorrect password.";
      return;
    }

    loadStudent(email, account.name);
    return;
  }

  if (!name || !confirmPassword) {
    loginError.textContent = "Please fill all signup fields.";
    return;
  }

  if (getAccount(email)) {
    loginError.textContent = "Account already exists. Use sign in.";
    setAuthMode("signin");
    return;
  }

  if (password !== confirmPassword) {
    loginError.textContent = "Passwords do not match.";
    return;
  }

  saveAccount(name, email, password);
  loadStudent(email, name);
});

signInTab.addEventListener("click", () => {
  setAuthMode("signin");
});

signUpTab.addEventListener("click", () => {
  setAuthMode("signup");
});

logoutButton.addEventListener("click", () => {
  saveCurrentStudent();
  currentStudentId = "";
  loginName.value = "";
  loginEmail.value = "";
  loginPassword.value = "";
  loginConfirmPassword.value = "";
  loginError.textContent = "";
  activeStudentId.textContent = "--";
  setAuthMode("signin");
  loginScreen.classList.remove("hidden");
  loginEmail.focus();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  analyze();
});

const inputFields = [
  fields.name,
  fields.location,
  ...fields.stressQuestions,
  fields.sleep,
  fields.study,
  fields.totalClasses,
  fields.attendedClasses,
  fields.notes,
];

inputFields.forEach((field) => {
  field.addEventListener("input", () => {
    if (hasCheckInInput()) {
      analyze();
    } else {
      setInitialState();
      saveCurrentStudent();
    }
  });
});

setAuthMode("signin");
setInitialState();
