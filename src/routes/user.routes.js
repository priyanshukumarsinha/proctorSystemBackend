// create a new file in the routes folder called user.routes.js and add the following code:

import express from 'express';
import { 
    createStudent, 
    loginStudent, 
    logoutStudent, 
    appointTeacher, 
    getStudents, 
    getTimetable, 
    getNotifications, 
    getCurrentUser, 
    getResult, 
    downloadResultJPG, 
    downloadResultPDF, 
    getAttendance, 
    getDayWiseAttendance, 
    getMeetings, 
    getPreviousMeetings, 
    raiseConcern, 
    getConcerns, 
    createProctor, 
    getProctors, 
    loginProctor, 
    logoutProctor, 
    getCurrentProctor, 
    getStudentsAppointed, 
    getTimetableProctor, 
    createNotificationProctor,
    setTimetableProctor
} from '../controllers/user.controllers.js';

const router = express.Router();

// student routes
router.post('/student/register', createStudent);
router.post('/student/login', loginStudent);
router.post('/student/logout', logoutStudent);
router.post('/student/appoint-proctor', appointTeacher);
router.get('/student/get-students', getStudents);
router.post('/student/get-timetable', getTimetable);
router.post('/student/notifications', getNotifications);
router.get('/student/get-current-user', getCurrentUser);
router.get('/student/get-result', getResult);
router.get('/student/download-result-jpg', downloadResultJPG);
router.get('/student/download-result-pdf', downloadResultPDF);
router.get('/student/get-attendance', getAttendance);
router.get('/student/get-day-wise-attendance', getDayWiseAttendance);
router.post('/student/get-meetings', getMeetings);
router.post('/student/get-previous-meetings', getPreviousMeetings);
router.post('/student/raise-concern', raiseConcern);
router.post('/student/get-concerns', getConcerns);

// proctor routes
router.post('/proctor/register', createProctor);
router.get('/proctor/get-proctors', getProctors);
router.post('/proctor/login', loginProctor);
router.post('/proctor/logout', logoutProctor);
router.get('/proctor/get-current-proctor', getCurrentProctor);
router.get('/proctor/get-students-appointed', getStudentsAppointed);
router.get('/proctor/get-timetable', getTimetableProctor);
router.post('/proctor/create-notification', createNotificationProctor);
router.post('/proctor/set-timetable', setTimetableProctor);


export  {router};

