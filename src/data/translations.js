export const translations = {
  en: {
    // ---------------- GENERAL ----------------
    appTitle: "E-Traffic Fine System",
    language: "Language",
    logout: "Logout",
    notifications: "Notifications",
    auditLog: "Audit Log",

    // ---------------- LOGIN ----------------
    loginDriver: "Login as Driver",
    loginAdmin: "Login as Admin",
    loginSubtitle: "Secure Digital Traffic Services",
    loginIdLabel: "NIC / Officer ID",
    loginPlaceholder: "Enter your NIC or ID",
    loginBtn: "Login",
    errEnterId: "Please enter your NIC or ID",
    backHome: "Back",
    demoCreds: "Demo Credentials",

    // ---------------- DRIVER DASHBOARD ----------------
    dashboard: "Dashboard",
    history: "History",
    complaints: "Complaints",
    fineId: "Fine ID",
    violation: "Violation",
    amount: "Amount",
    date: "Date",
    location: "Location",
    status: "Status",
    payNow: "Pay Now",
    statusPaid: "Paid",
    statusUnpaid: "Unpaid",

    // ---------------- COMPLAINTS ----------------
    submitComplaint: "Submit Complaint",
    reason: "Reason",
    description: "Description",
    submit: "Submit",
    myComplaints: "My Complaints",
    pending: "Pending",
    resolved: "Resolved",

    // ---------------- ADMIN ----------------
    adminDashboard: "Admin Dashboard",
    approve: "Approve",
    reject: "Reject",

    // ---------------- DRIVER HOME ----------------
    driverHomeTitle: "Driver Home",
    driverHomeSub: "Choose what you want to do.",
    driverTilePay: "Pay a Fine",
    driverTilePayDesc:
      "Search and pay using your fine reference or NIC.",
    driverTileHistory: "Payment History",
    driverTileHistoryDesc:
      "View paid and pending fines, receipts and details.",
    driverTileComplaints: "Complaints & Appeals",
    driverTileComplaintsDesc:
      "Submit a complaint or check your complaint status.",
    driverTipTitle: "Tip",
    driverTip:
      "If you are not sure, start with Pay a Fine — it guides you step by step.",

    // ---------------- POLICE HOME ----------------
    policeHomeTitle: "Police Home",
    policeHomeSub: "Quick actions for officers.",
    policeTileIssue: "Issue a Fine",
    policeTileIssueDesc:
      "Create and submit a new fine for a driver.",
    policeTileHistory: "Issued Fines",
    policeTileHistoryDesc:
      "View fines you issued and their payment status.",
    policeTileVerify: "Verify Payment",
    policeTileVerifyDesc:
      "Check whether a fine is paid (show receipt).",
    policeTipTitle: "Note",
    policeTip:
      "Always verify NIC/License details before submitting a fine.",

    // ---------------- LANGUAGE + ROLES ----------------
    langEnglish: "English",
    langSinhala: "Sinhala",
    langTamil: "Tamil",
    roleDriver: "Driver",
    rolePolice: "Police",
    roleAdmin: "Admin",
    roleGuest: "Guest",

    // ---------------- SHARED UI ----------------
    openNavigation: "Open navigation menu",
    closeNavigation: "Close navigation menu",
    goRoleHome: "Go to role home page",
    openNotifications: "Open notifications",
    closeModal: "Close modal",
    close: "Close",
    themeLight: "Light",
    themeDark: "Dark",
    switchToLightMode: "Switch to light mode",
    switchToDarkMode: "Switch to dark mode",
    total: "total",
    noNotifications: "No notifications.",
    operations: "Operations",
    user: "User",
    police: "Police",
    ambulance: "Ambulance",
    fire: "Fire",
    details: "Details",
    timestamp: "Timestamp",
    action: "Action",

    // ---------------- LOGIN EXTENDED ----------------
    govOfSriLanka: "Government of Sri Lanka",
    departmentOfMotorTraffic: "Department of Motor Traffic",
    secureLogin: "Secure Login",
    loginIllustrationAlt: "Official service illustration",
    loginPanelLine1: "Official portal for drivers, officers, and administrators.",
    loginPanelLine2: "Use your NIC / Officer ID to access your dashboard.",
    loginPanelLine3: "Authorized access only. Activity may be recorded for compliance.",
    loginDemoHint: "Police: POL999, Driver: 901234567V, Admin: ADM999",
    errInvalidId: "Invalid NIC / Officer ID / Admin ID",

    // ---------------- DRIVER DASHBOARD ----------------
    paymentsDashboardTitle: "Payments Dashboard",
    paymentsDashboardSub:
      "Review outstanding violations, settle payments, and keep records up to date.",
    unpaidFinesTitle: "Unpaid Fines",
    unpaidFinesSub:
      "Pay pending fines securely and generate a confirmation receipt instantly.",
    pendingFines: "Pending Fines",
    totalDue: "Total Due",
    accountStatus: "Account Status",
    actionRequired: "Action Required",
    noPendingViolations: "No Pending Violations",
    pendingViolations: "Pending Violations",
    noPendingFines: "No pending fines",
    upToDateDriveSafely: "You are fully up to date. Keep driving safely.",
    fineLabel: "Fine",
    nicShort: "NIC",
    notCaptured: "Not captured",
    vehicleLabel: "Vehicle",
    notSpecified: "Not specified",
    reference: "Reference",
    payMyFine: "Pay my fine",

    // ---------------- PAYMENT MODAL ----------------
    paymentSuccessfulTitle: "Payment Successful",
    paymentConfirmed: "Payment Confirmed",
    receiptGeneratedForFine: "Receipt generated for fine",
    downloadOfficialPdf: "Download Official PDF Receipt",
    officialPdfDownloaded: "Official PDF receipt downloaded.",
    officialPdfDownloadFailed:
      "If the PDF did not download, use the button below.",
    payFine: "Pay Fine",
    officialFineDetails: "Official fine details",
    card: "Card",
    qr: "QR",
    totalAmount: "Total Amount",
    errEnterOtp: "Enter the OTP code.",
    errInvalidOtp: "Invalid OTP code. Please try again.",
    securityVerification: "Security verification",
    otpSentNotice:
      "We sent a one-time password (OTP) to your registered contact.",
    demoOtp: "Demo OTP",
    otpCode: "OTP Code",
    otpPlaceholder: "6-digit code",
    resendOtp: "Resend OTP",
    confirmAndPay: "Confirm & Pay",
    cardNumber: "Card Number",
    expiry: "Expiry",
    cvc: "CVC",
    continue: "Continue",
    qrPayAlt: "QR code to pay fine",
    scanQrPrompt:
      "Scan this code with your banking app to confirm payment securely.",
    verifying: "Verifying...",

    // ---------------- COMPLAINTS ----------------
    complaintFormSub:
      "Provide accurate information so administrators can review quickly.",
    fineIdPlaceholder: "e.g. f101",
    reasonUnfairFine: "Unfair Fine",
    reasonOfficerMisconduct: "Officer Misconduct",
    reasonSystemError: "System Error",
    reasonOther: "Other",
    complaintDescriptionPlaceholder: "Describe your complaint...",
    attachEvidenceDemo: "Attach Evidence (Image/PDF) - Demo",
    complaintListSub:
      "Track progress and final decisions on each submitted complaint.",
    noComplaintsYet: "No complaints submitted yet.",
    submittedOn: "Submitted on",
    rejected: "Rejected",
    noAdditionalDescription: "No additional description provided.",
    complaintsPageSub:
      "Submit appeal requests with evidence and monitor each complaint lifecycle status.",

    // ---------------- HISTORY ----------------
    historyPageSub:
      "View all issued fines, payment status, and location details in one audit-ready table.",
    historyEmpty: "No fine history found for this account.",
    paidOn: "Paid on",

    // ---------------- ADMIN ----------------
    adminDashboardSub:
      "Review complaint queues, apply final decisions, and keep the full event trail ready for compliance checks.",
    complaintsQueue: "Complaints Queue",
    noPendingComplaints: "No pending complaints to review.",
    viewAttachmentDemo: "View Attachment (Demo)",
    systemAuditLog: "System Audit Log",
    systemAuditLogSub:
      "Chronological trail of payments, complaint updates, and enforcement actions.",
    noAuditEvents: "No events logged yet.",
    auditActionFineIssued: "Fine Issued",
    auditActionPayment: "Payment",
    auditActionComplaintSubmit: "Complaint Submitted",
    auditActionComplaintUpdate: "Complaint Updated",

    // ---------------- POLICE DASHBOARD ----------------
    trafficControlUnit: "Traffic Control Unit",
    policeDashboardSub:
      "Manage enforcement records, issue violation sheets, and verify field-side payment status.",
    totalFines: "Total Fines",
    recentIssuedFines: "Recent Issued Fines",
    recentIssuedFinesSub:
      "Monitor latest fine activity and payment outcomes.",
    noFinesAvailable: "No fines available.",
    vehicleNotSet: "Vehicle not set",

    // ---------------- ISSUE FINE FORM ----------------
    newTrafficViolationEntry: "New Traffic Violation Entry",
    issueFineFormSub:
      "Complete all fields and submit to generate a new fine record.",
    officerForm: "Officer Form",
    fineIssuedSuccess: "Fine sheet issued successfully.",
    fineLinkedToDriverNic: "Fine linked to driver NIC {nic}.",
    driverNicLicense: "Driver NIC / License",
    driverNicPlaceholder: "e.g. 901234567V",
    offenderName: "Offender Name",
    fullName: "Full Name",
    addressOptional: "Address (Optional)",
    driverAddressPlaceholder: "Driver address",
    vehicleNumber: "Vehicle Number",
    vehiclePlaceholder: "WP CAA-1234",
    locationPlaceholder: "City / street",
    locationPoliceStationPlaceholder:
      "Type and select a Sri Lanka police station",
    locationPoliceStationHint:
      "{count} Sri Lanka police stations loaded. Start typing to filter.",
    noPoliceStationMatch: "No matching police station found.",
    violationType: "Violation Type",
    totalFineAmount: "Total Fine Amount",
    processing: "Processing...",
    issueFineSheet: "Issue Fine Sheet",
    errInvalidNic: "Enter a valid NIC (9 digits + V/X or 12 digits).",
    errVehicleRequired: "Vehicle number is required.",
    errLocationRequired: "Location is required.",
    errSelectValidPoliceStation:
      "Please select a valid Sri Lanka police station from the list.",
    errOffenderRequired: "Offender name is required.",
    unspecifiedViolation: "Unspecified Violation",

    // ---------------- ROLE HOME SHELL ----------------
    officialService: "Official Service",
    check: "Check",
    searchByNicVehicleFine:
      "You can search by NIC, vehicle number, or fine reference.",
    howItWorks: "How It Works",
    howItWorksSub: "Three simple steps to complete your task.",
    illustrationPlaceholder: "Illustration Placeholder",
    helpAndSupport: "Help and Support",
    helpAndSupportDesc:
      "Use the complaints section if details are incorrect. Keep your payment receipt for reference.",
    emergency: "Emergency",
    emergencyDesc: "Instant access to Police and Ambulance services.",
    footerSecureOps: "E-Traffic Services. Secure Digital Operations.",

    // ---------------- DRIVER HOME ----------------
    driverPortalBadge: "Driver Digital Portal",
    driverHomeHeroTitle1: "Traffic Fines",
    driverHomeHeroTitle2: "Handled In Minutes",
    driverHomeHeroSub:
      "Check violations, complete payments, and track disputes from one secure dashboard built for fast everyday use.",
    driverSearchLabel: "Search fines",
    driverSearchPlaceholder:
      "Vehicle number / NIC / Fine reference (e.g., WP CAA-1234)",
    findFine: "Find Fine",
    currentBalance: "Current Balance",
    security: "Security",
    encryptedTransactions: "Encrypted transactions and verified receipts",
    driverActionPayTitle: "Pay Fines",
    driverActionPayDesc:
      "Clear unpaid fines with secure card or QR payment.",
    driverActionDisputesTitle: "Disputes",
    driverActionDisputesDesc:
      "Submit appeals and track responses from administrators.",
    driverActionHelpTitle: "Help Center",
    driverActionHelpDesc:
      "Get support details and emergency contact access.",
    driverStatProcessed: "Fines Processed",
    driverStatRegistered: "Registered Drivers",
    driverStatAvailability: "Service Availability",
    driverStatTraceability: "Receipt Traceability",
    driverStepsTitle: "How Driver Flow Works",
    driverStepsSub: "Use this three-step sequence for fast compliance.",
    driverStep1Title: "Search",
    driverStep1Desc:
      "Use NIC, vehicle number, or fine reference to pull exact records.",
    driverStep2Title: "Review and Pay",
    driverStep2Desc:
      "Confirm violation details and pay through supported channels.",
    driverStep3Title: "Store Receipt",
    driverStep3Desc:
      "Get instant confirmation and preserve proof for future checks.",

    // ---------------- POLICE HOME ----------------
    policePortalBadge: "Police Operations Portal",
    policeHomeHeroTitle1: "Officer Console",
    policeHomeHeroTitle2: "Fast, Accurate, Auditable",
    policeHomeHeroSub:
      "Issue violations, verify payments, and review enforcement activity through a secure role-based workflow.",
    policeSearchLabel: "Search fines and drivers",
    policeSearchPlaceholder:
      "Driver NIC / license number / fine reference",
    searchRecords: "Search Records",
    liveStatus: "Live Status",
    auditLoggingEnabled:
      "Audit logging enabled for all officer actions",
    avgSearch: "Avg Search",
    syncHealth: "Sync Health",
    policeActionIssueTitle: "Issue Fine",
    policeActionIssueDesc:
      "Create and submit a fine sheet in one guided form.",
    policeActionIssuedTitle: "Issued Fines",
    policeActionIssuedDesc:
      "Review recently issued fines and payment updates.",
    policeActionVerifyTitle: "Verify Payment",
    policeActionVerifyDesc:
      "Confirm receipt status during roadside checks.",
    policeStatAccess: "Officer Access",
    policeStatAvailability: "Availability",
    policeStatQuery: "Average Query Time",
    policeStatAudit: "Audit Coverage",
    policeStepsTitle: "Officer Workflow",
    policeStepsSub: "Three steps to complete field actions safely.",
    policeStep1Title: "Find Record",
    policeStep1Desc:
      "Search by NIC, license, or fine reference before issuing actions.",
    policeStep2Title: "Issue or Verify",
    policeStep2Desc:
      "Create a fine sheet or validate paid status against receipt data.",
    policeStep3Title: "Complete Audit Trail",
    policeStep3Desc:
      "Every transaction is logged with timestamp and officer metadata.",
    policeHq: "Police HQ",
    trafficHotline: "Traffic Hotline",

    // ---------------- NOTIFICATION TEMPLATES ----------------
    notifFineIssued: "New traffic fine {fineId} issued for NIC {nic}",
    notifPaymentSuccessful: "Fine Payment Successful. Receipt #{receiptNo}",
    notifComplaintSubmitted:
      "Complaint Submitted Successfully. Reference #{complaintId}",
    notifComplaintStatusUpdated:
      "Complaint #{complaintId} marked as {status}",
    notifWelcome: "Welcome to E-Traffic Fine System",

    // ---------------- AUDIT DETAILS TEMPLATES ----------------
    logFineIssued: "Fine #{fineId} issued to NIC {nic}",
    logPayment: "Fine #{fineId} paid. Receipt #{receiptNo}",
    logComplaintSubmitted: "Complaint #{complaintId} submitted",
    logComplaintUpdated: "Complaint #{complaintId} {status}"
  },

  // ================= SINHALA =================
  si: {
    appTitle: "රථවාහන දඩ මුදල් පද්ධතිය",
    language: "භාෂාව",
    logout: "ඉවත් වන්න",
    notifications: "දැනුම්දීම්",
    auditLog: "විගණන සටහන්",

    loginDriver: "රියදුරු ලෙස පිවිසෙන්න",
    loginAdmin: "පරිපාලක ලෙස පිවිසෙන්න",
    loginSubtitle: "ආරක්ෂිත ඩිජිටල් රථවාහන සේවාව",
    loginIdLabel: "ජා.හැ. අංකය / නිලධාරී අංකය",
    loginPlaceholder: "ඔබගේ ජා.හැ. හෝ ID ඇතුළත් කරන්න",
    loginBtn: "පිවිසෙන්න",
    errEnterId: "කරුණාකර ID ඇතුළත් කරන්න",
    backHome: "ආපසු",
    demoCreds: "ඩෙමෝ අංක",

    dashboard: "මුල් පිටුව",
    history: "ඉතිහාසය",
    complaints: "පැමිණිලි",
    fineId: "දඩ අංකය",
    violation: "වරද",
    amount: "මුදල",
    date: "දිනය",
    location: "ස්ථානය",
    status: "තත්වය",
    payNow: "ගෙවන්න",
    statusPaid: "ගෙවා ඇත",
    statusUnpaid: "ගෙවා නැත",

    submitComplaint: "පැමිණිලි ඉදිරිපත් කරන්න",
    reason: "හේතුව",
    description: "විස්තරය",
    submit: "ඉදිරිපත් කරන්න",
    myComplaints: "මගේ පැමිණිලි",
    pending: "විසඳා නැත",
    resolved: "විසඳා ඇත",

    adminDashboard: "පරිපාලක පුවරුව",
    approve: "අනුමත කරන්න",
    reject: "ප්‍රතික්ෂේප කරන්න",

    driverHomeTitle: "රියදුරු මුල් පිටුව",
    driverHomeSub: "ඔබට අවශ්‍ය සේවාව තෝරන්න.",
    driverTilePay: "දඩ මුදල ගෙවන්න",
    driverTilePayDesc: "දඩ අංකය හෝ ජා.හැ. භාවිතා කර ගෙවන්න.",
    driverTileHistory: "ගෙවීම් ඉතිහාසය",
    driverTileHistoryDesc: "ගෙවූ හා නොගෙවූ දඩ බලන්න.",
    driverTileComplaints: "පැමිණිලි සහ අභියාචනා",
    driverTileComplaintsDesc: "පැමිණිලි ඉදිරිපත් කරන්න හෝ තත්වය බලන්න.",
    driverTipTitle: "ඉඟිය",
    driverTip: "සැකයක් ඇත්නම්, දඩ මුදල ගෙවීමෙන් ආරම්භ කරන්න.",

    policeHomeTitle: "පොලිස් මුල් පිටුව",
    policeHomeSub: "නිලධාරීන් සඳහා ඉක්මන් ක්‍රියා.",
    policeTileIssue: "දඩ නිකුත් කරන්න",
    policeTileIssueDesc: "නව දඩයක් සකස් කර යවන්න.",
    policeTileHistory: "නිකුත් කළ දඩ",
    policeTileHistoryDesc: "ඔබ නිකුත් කළ දඩ බලන්න.",
    policeTileVerify: "ගෙවීම් තහවුරු කරන්න",
    policeTileVerifyDesc: "දඩ ගෙවී ඇත්දැයි පරීක්ෂා කරන්න.",
    policeTipTitle: "සටහන",
    policeTip: "දඩ නිකුත් කිරීමට පෙර ජා.හැ. තහවුරු කරන්න."
  },

  // ================= TAMIL =================
  ta: {
    appTitle: "மின் போக்குவரத்து அபராத அமைப்பு",
    language: "மொழி",
    logout: "வெளியேறு",
    notifications: "அறிவிப்புகள்",
    auditLog: "தணிக்கை பதிவு",

    loginDriver: "டிரைவராக உள்நுழையவும்",
    loginAdmin: "நிர்வாகியாக உள்நுழையவும்",
    loginSubtitle: "பாதுகாப்பான டிஜிட்டல் போக்குவரத்து சேவை",
    loginIdLabel: "NIC / அதிகாரி ID",
    loginPlaceholder: "உங்கள் ID ஐ உள்ளிடவும்",
    loginBtn: "உள்நுழை",
    errEnterId: "ID ஐ உள்ளிடவும்",
    backHome: "திரும்ப",
    demoCreds: "டெமோ சான்றுகள்",

    dashboard: "முகப்பு",
    history: "வரலாறு",
    complaints: "புகார்கள்",
    fineId: "அபராத எண்",
    violation: "மீறல்",
    amount: "தொகை",
    date: "தேதி",
    location: "இடம்",
    status: "நிலை",
    payNow: "செலுத்துங்கள்",
    statusPaid: "செலுத்தப்பட்டது",
    statusUnpaid: "செலுத்தப்படவில்லை",

    submitComplaint: "புகார் சமர்ப்பிக்கவும்",
    reason: "காரணம்",
    description: "விளக்கம்",
    submit: "சமர்ப்பிக்கவும்",
    myComplaints: "எனது புகார்கள்",
    pending: "நிலுவையில்",
    resolved: "தீர்க்கப்பட்டது",

    adminDashboard: "நிர்வாக டாஷ்போர்டு",
    approve: "ஒப்புதல்",
    reject: "நிராகரி",

    driverHomeTitle: "ஓட்டுநர் முகப்பு",
    driverHomeSub: "நீங்கள் செய்ய விரும்பும் செயலைத் தேர்ந்தெடுக்கவும்.",
    driverTilePay: "அபராதம் செலுத்து",
    driverTilePayDesc: "NIC அல்லது அபராத எண் மூலம் செலுத்தவும்.",
    driverTileHistory: "கட்டண வரலாறு",
    driverTileHistoryDesc: "செலுத்திய மற்றும் நிலுவை அபராதங்களைப் பாருங்கள்.",
    driverTileComplaints: "புகார்கள் & முறையீடுகள்",
    driverTileComplaintsDesc: "புகார் சமர்ப்பிக்கவும் அல்லது நிலையைச் சரிபார்க்கவும்.",
    driverTipTitle: "குறிப்பு",
    driverTip: "உறுதி இல்லையெனில் அபராதம் செலுத்துதல் மூலம் தொடங்கவும்.",

    policeHomeTitle: "போலீஸ் முகப்பு",
    policeHomeSub: "அதிகாரிகளுக்கான விரைவான செயல்கள்.",
    policeTileIssue: "அபராதம் வழங்கு",
    policeTileIssueDesc: "புதிய அபராதம் உருவாக்கவும்.",
    policeTileHistory: "வழங்கிய அபராதங்கள்",
    policeTileHistoryDesc: "நீங்கள் வழங்கிய அபராதங்களைப் பாருங்கள்.",
    policeTileVerify: "கட்டணத்தை சரிபார்",
    policeTileVerifyDesc: "அபராதம் செலுத்தப்பட்டதா எனச் சரிபார்க்கவும்.",
    policeTipTitle: "குறிப்பு",
    policeTip: "அபராதம் வழங்குவதற்கு முன் NIC சரிபார்க்கவும்."
  }
};
