export const apis = {
  photoApi: 'https://api.slingacademy.com/v1/sample-data/photos',
  jsonApi: 'https://jsonplaceholder.typicode.com/posts',
} as const;

export const authApi = {
  sendOtpLogin: '/auth/send-mobile-otp',
  verifyOtpLogin: '/auth/verify-mobile-otp',
  getCaptcha: '/auth/get-captcha',
  login: '/auth/login',
  loginWithOtp: '/auth/send-otp-via-mobile',
  loginVerifyOtp: '/auth/verify-otp-and-login',
  register: '/auth/register',
  sendOtpViaEmail: '/auth/send-otp',
  verifyOtp: '/auth/verify-otp',
  resetPassword: '/auth/reset-password',
  getUser: '/user/get-user',
  updateDeviceToken: '/user/update-device-token',
  updateProfileImg: '/user/upload-image-url',
  updateProfile: '/user/update-profile',
  changePassword: '/user/change-password',
} as const;

export const feeDemandApi = {
  feeDemandByStudentId: '/demand/get-fee-demand-by-student-id',
  feeDemandByStudentIdStatics: '/demand/get-fee-demand-by-student-id-statics',
  getFeeStudentIdByMonth: '/demand/get-fee-student-id-by-month',
  updateFeeDemand: '/demand/update-fee-demand',
  getFeeDemandAmountBySid: '/demand/get-fee-demand-amount-by-sid',
  getDemandAmountByStudentId: '/demand/get-total-fee-amount-by-student',
} as const;

export const paymentApi = {
  createOrder: '/rzpl/create-razorpay-order',
} as const;

export const transactionApi = {
  getLastTransaction: '/transaction/get-last-transaction',
  getTransactionListByStudentId:
    '/transaction/get-transaction-list-by-student-id',
  getReceipt: '/transaction/get-receipt-by-transaction-no',
} as const;

export const otherApi = {
  getNotifications: 'student/fetch-notification',
  getStudentByAuth: 'student/get-student-details-by-auth',
  getNotificationByUser: 'notification/get-notifications-by-user',
  updateNotificationByUser: 'notification/update-notifications-by-user',
  getNotificationCount: 'notification/get-unread-notification-count-by-user',
  getAllSyllabus: '/syllabus/get-all-syllabus-by-terms',
} as const;

export const libraryApi = {
  getBookList: 'book/get-all-books',
  getMyBooks: 'book/get-my-books',
  getMyBookHistory: 'book/get-my-book-history',
  getMyBookCount: 'book/get-active-books-count',
  getLibrayTransactionByStudent:
    'library-transaction/get-penalty-transaction-list-by-student',
  getPenaltyReceipt: 'library-transaction/get-penalty-receipt-by-transactionNo',
  getBookById: 'book/get-book-by-id',
  getIssueBookById: 'book/get-issue-book-by-id',
  updatePenaltyMoney: 'library-transaction/update-penalty-money',
} as const;

export const timeTableApi = {
  getTimeTable: '/time-table/get-by-class-id',
  getAllMonths: '/month/get-all-months',
  getFacultyByClassIdAndSectionId:
    '/time-table/get-faculty-by-class-id-and-section-id',
} as const;

export const commonApi = {
  classList: '/class/get-all-class',
  getSectionByClassId: '/section/get-section-by-class-id',
  getAllSessions: '/session/get-all-sessions',
  getAllActiveSession: '/session/get-all-active-sessions',
  getAllTerm: '/terms/get-all-terms',
  getTermByClassId: '/terms/get-terms-by-class-id',
  getClassWiseSubjectByClassId: '/class-wise-subject/get-by-classId',
  chqBounceDetailByStudent: '/bounce-charge/unpaid-bounce-charges-by-student',
} as const;

export const examApi = {
  createExam: '/exam/create-exam',
  getAllExamByCreated: '/exam/get-all-filter',
  updateExamMarks: '/exam/update-exam-by-id',
  getExamMarks: '/exam/get-exam-by-id',
  updateExamBBulk: '/exam/update-exam-status-by-id',
  getResultByStudent: '/exam/get-exam-by-student',
  UpdateExamMarksNew: '/exam/update-exam-marks',
  getMarksByClass: '/marks/get-all-marks',
};

export const facultyApi = {
  GetClassFacultyId: '/faculty/get-class-by-faculty-id',
  GetSectionById: '/faculty/get-section-by-faculty-id',
  GetSubjectById: '/faculty/get-subject-by-faculty-id',
  GetStudentAttendanceList: '/attendance/get-students-by-class-and-section',
  GetMonthList: '/month/get-all-months',
  CreateAttendance: '/attendance/create-attendance',
  updateAttendance: '/attendance/update-attendance',
  scheduleTimeTable: '/time-table/get-by-faculty-id',
  getAttendanceTrackerByStudent:
    '/attendance/get-attendance-list-by-student-id',
  createSchoolDiary: '/school-diary/create-school-diary',
  getSchoolDiary: '/school-diary/get-school-diary-by-student-id',
  getSchoolDiaryById: '/school-diary/get-school-diary-by-id',
  createSchoolDairy: '/school-diary/create-school-diary',
  editSchoolDiary: '/school-diary/get-school-diary-by-id',
  updateSchoolDairy: '/school-diary/update-school-diary',
  createResult: '/exam/get-exam-by-faculty',
} as const;

export const attendanceApi = {
  GetStudentAttendanceList:
    '/attendance/get-attendance-by-student-id-and-month-id',
  GetAttendancePercentage:
    '/attendance/get-attendance-by-student-id-with-percentage',
  GetAttendanceByMonth: '/attendance/get-attendance-percentage-by-student-id',
  getAttendanceList: '/attendance/get-attendance-report-data',
  getAttendanceListByClassSectionSession:
    '/attendance/get-attendance-by-classId-section',
} as const;

export const schoolApi = {
  getSchoolId: '/super/verify-db',
};
export const circularApi = {
  getMyCirculars: '/circular-event/fetch-all-by-class',
  circularByClassId: 'circular-event/circular-event-by-class-id',
  eventById: '/circular-event/fetch-by-id',
};
export const assignmentApi = {
  assignmentByClassId: '/assignment/assignment-by-class-id',
  assignmentById: '/assignment/fetch-by-id',
  getAssignmentById: '/assignment/fetch-by-id',

  createAssignmentBySection: '/assignmentBySection/create',
  getAllAssignmentsBySection: '/assignmentBySection/fetch-all',
  getAssignmentBySectionById: '/assignmentBySection/fetch-by-id',
  updateAssignmentBySectionById: '/assignmentBySection/update',
  deleteAssignmentBySectionById: '/assignmentBySection/delete',
};

export const complaintApi = {
  createComplaint: '/complaint/create', // POST API to create a complaint
  getComplaintById: '/complaint/fetch-by-id', // GET API to fetch complaint by ID
  getPaginatedComplaintsByCategory: '/complaint/get-paginated-by-category', // GET API for paginated complaints
  uploadComplaintImage: '/complaint/upload-complaint-image',
  complaintByStudentId: '/complaint/complaint-by-student-id',
  createComplaintNew: '/complaint/create-complaint',
  complaintById: '/complaint/complaint-by-id',
};

export const reviewApi = {
  createreview: '/review/create', // POST API to create a complaint
  getReviewById: '/review/getbyid', // GET API to fetch complaint by ID
};

export const leaveRequestApi = {
  applyLeaveRequest: '/leave-request/apply-leave-request',
  getMyLeaveRequest: '/leave-request/fetch-leave-request-by-student',
  getMyLeaveRequestById: '/leave-request/fetch-leave-request-by-id',
};

export const paymentGatewayApi = {
  payNow: '/payment/pay-now',
  payNowDev: '/payment/pay-now-dev',
};
