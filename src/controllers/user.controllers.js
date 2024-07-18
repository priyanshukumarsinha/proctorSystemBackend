import {prisma} from '../../prisma/index.js'

// create a new student
const createStudent = async (req, res) => {

    const {name, email, password, rollNo, role, sem, firstName, lastName, USN, phoneNumber, fatherMobileNumber, motherMobileNumber, photoURL} = req.body;
    // console.log(req.teacherId);
    try {
        // prism = orm
        const student = await prisma.student.create({
            data: {
                email,
                password,
                role,
                firstName,
                lastName,
                USN,
                sem,
                phoneNumber,
                fatherMobileNumber,
                motherMobileNumber,
                rollNo,
                photoURL,
            },
        });

        if(!student) {
            return res.status(400).json({error: 'Invalid Data'});
        }

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({error: 'Server Error', error});
    }
};

// login student
const loginStudent = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({error: 'Invalid Data'});
    }

    try {
        const student = await prisma.student.findUnique({
            where: {
                email
            },
            include: {
                AppointProctor: true
            }

        });

        if (!student) {
            return res.status(400).json({error: 'Invalid Credentials'});
        }

        
        if (student.password !== password) {
            return res.status(400).json({error: 'Invalid Credentials'});
        }
        
        // change the appointed prcotor id to the complete proctor object
        
        if(student.AppointProctor.length>0) {
            const proctor = await prisma.teacher.findUnique({
                where: {
                    id: student.AppointProctor[0].teacherId
                }
            });
            
            student.AppointProctor[0].teacherId = proctor;
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({error: 'Server Error'});
    }
};

// logout student
const logoutStudent = async (req, res) => {
    res.status(200).json({message: 'Logout Success'});
};

// appoint a teacher to a student
const appointTeacher = async (req, res) => {
    const {teacherId, studentId} = req.body;

    if(!teacherId || !studentId) {
        return res.status(400).json({error: 'Invalid Data'});
    }

    // check if teacher exists
    const teacher = await prisma.teacher.findUnique({
        where: {
            id: teacherId
        }
    });
    
    if(!teacher) {
        return res.status(400).json({error: 'Teacher not found'});
    }
    
    // check if student exists
    const student = await prisma.student.findUnique({
        where: {
            id: studentId
        }
    });
    
    if(!student) {
        return res.status(400).json({error: 'Student not found'});
    }
    
    // check if teacher is already appointed to the student
    const isAppointed = await prisma.appointment.findFirst({
        where: {
            teacherId,
            studentId
        }
    });
    
    if(isAppointed) {
        
        return res.status(400).json({error: 'Teacher already appointed to the student'});
        
    }
    
    try{
        const appointment = await prisma.appointment.create({
            data: {
                teacherId,
                studentId
            }
        });
        console.log(teacher)
        
        if(!appointment) {
            res.send(500).json("")
        }

        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            },
            include: {
                AppointProctor: true
            }
        });

        // change the appointed prcotor id to the complete proctor object
        if(student.AppointProctor.length>0) {
            const proctor = await prisma.teacher.findUnique({
                where: {
                    id: student.AppointProctor[0].teacherId
                }
            });
            
            student.AppointProctor[0].teacherId = proctor;
        }

        res.status(201).json(student);

    }
    catch(error){
        res.status(500).json({error: 'Server Error', error});
    }
};

// get all students appointed to a teacher
const getStudents = async (req, res) => {};

// get timetable for a student
const getTimetable = async (req, res) => {
    // take data from the timetable table
    const proctorId = req.body.proctorId;
    if(!proctorId) {
        return res.status(400).json({error: 'Invalid Data'});
    }

    // check if proctor exists
    const proctor = await prisma.teacher.findUnique({
        where: {
            id: proctorId
        }
    });

    if(!proctor) {
        return res.status(400).json({error: 'Proctor not found'});
    }

    try {
        const timetable = await prisma.timetable.findMany({
            where: {
                teacherId: proctorId
            }
        });

        res.status(200).json(timetable);
    }
    catch(error){
        res.status(500).json({error: 'Server Error', error});
    }
};

// get all notifications for a student from their proctor
const getNotifications = async (req, res) => {
    // take data from the notifications table
    const {proctorId} = req.body;
    if(!proctorId) {
        return res.status(400).json({error: 'Invalid Data'});
    }

    // check if proctor exists
    const proctor = await prisma.teacher.findUnique({
        where: {
            id: proctorId
        }
    });

    if(!proctor) {
        return res.status(400).json({error: 'Proctor not found'});
    }

    try {
        const notifications = await prisma.notification.findMany({
            where: {
                teacherId: proctorId
            }
        });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({error: 'Server Error', error});
    }


};

// get current user
const getCurrentUser = async (req, res) => {};

// get result for a student from the database as per the semester selected
const getResult = async (req, res) => {};

// download result as JPG
const downloadResultJPG = async (req, res) => {};

// download result as PDF
const downloadResultPDF = async (req, res) => {};

// get attendance of all subject for a student
const getAttendance = async (req, res) => {};

// get day wise attendance of all subject for a student
const getDayWiseAttendance = async (req, res) => {};

// get all upcoming meeting for a student from their proctor
const getMeetings = async (req, res) => {
    const {studentId, proctorId} = req.body;

    if(!studentId || !proctorId) {
        return res.status(400).json({error: 'Invalid Data'});
    }

    try {
        const meetings = await prisma.meeting.findMany({
            where: {
                studentId,
                proctorId,
                status: 'upcoming',
            }
        });

        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({error: 'Server Error', error});
    }
};

// get all previous meeting for a student from their proctor
const getPreviousMeetings = async (req, res) => {
    const {studentId, proctorId} = req.body;

    if(!studentId || !proctorId) {
        return res.status(400).json({error: 'Invalid Data'});
    }

    try {
        const meetings = await prisma.meeting.findMany({
            where: {
                studentId,
                proctorId,
                status: 'completed',
            }
        });

        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({error: 'Server Error', error});
    }
};

// raise a concern from a student to their proctor
const raiseConcern = async (req, res) => {
    const {subject, concern, studentId, proctorId} = req.body;
    
    if(!subject || !concern || !studentId || !proctorId) {
        return res.status(400).json({error: 'Invalid Data'});
    }
    
    console.log(req.body);
    try{
        const response = await prisma.concerns.create({
            data: {
                concern,
                studentId,
                proctorId,
                subject
            }
        });
        res.status(201).json(response);
    }
    catch(error){
        res.status(500).json({error: 'Server Error', error});
    }
};

// get all concerns raised by a student
const getConcerns = async (req, res) => {
    const {studentId, proctorId} = req.body;

    if(!studentId || !proctorId) {
        return res.status(400).json({error: 'Invalid Data'});
    }

    try {
        if(studentId === 'all'){
            const concerns = await prisma.concerns.findMany({
                where: {
                    proctorId
                }
            });
            return res.status(200).json(concerns);
        }

        const concerns = await prisma.concerns.findMany({
            where: {
                studentId,
                proctorId
            }
        });

        res.status(200).json(concerns);
    } catch (error) {
        res.status(500).json({error: 'Server Error', error});
    }
};

// TEACHER

// create a new proctor
const createProctor = async (req, res) => {
    const {name, email, password, firstName, lastName, phoneNumber, photoURL} = req.body;

    try {
        const proctor = await prisma.teacher.create({
            data: {
                name,
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                photoURL,
                
            }
        });
        res.status(201).json(proctor);
    } catch (error) {
        res.status(500).json({error: 'Server Error', error});
    }
};

// get all proctors
const getProctors = async (req, res) => {};

// login proctor
const loginProctor = async (req, res) => {
    const {email, password} = req.body;

    try {
        const proctor = await prisma.teacher.findUnique({
            where: {
                email
            },
            include: {
                AppointProctor: true
            }
        });

        if (!proctor) {
            return res.status(400).json({error: 'Invalid Credentials'});
        }

        if (proctor.password !== password) {
            return res.status(400).json({error: 'Invalid Credentials'});
        }
        
        res.status(200).json(proctor);
    } catch (error) {
        res.status(500).json({error: 'Server Error'});
    }
};

// logout proctor
const logoutProctor = async (req, res) => {};

// get current proctor
const getCurrentProctor = async (req, res) => {};

// get all students appointed to a teacher
const getStudentsAppointed = async (req, res) => {};

// get timetable from a proctor
const getTimetableProctor = async (req, res) => {};

// create a new notification from a proctor
// model Notification {
//     id        String   @id @default(cuid())
//     title     String
//     message   String
//     proctorId Teacher  @relation(fields: [teacherId], references: [id])
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//     teacherId String
//   }
const createNotificationProctor = async (req, res) => {
    // create notification in the notifications table
    const {title, message, proctorId} = req.body;
    
    console.log(req.body);

    if(!title || !message || !proctorId) {
        return res.status(400).json({error: 'Invalid Data'});
    }

    // check if proctor exists
    const proctor = await prisma.teacher.findUnique({
        where: {
            id: proctorId
        }
    });

    if(!proctor) {
        return res.status(400).json({error: 'Proctor not found'});
    }

    try {
        const notification = await prisma.notification.create({
            data: {
                title,
                message,
                teacherId: proctorId
            }
        });

        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({error: 'Server Error', error});
    }
};

// set timetable for a proctor
// model Timetable {
//     id        String   @id @default(cuid())
//     day       String
//     startTime DateTime
//     endTime   DateTime
//     subject   String
//     proctorId Teacher  @relation(fields: [teacherId], references: [id])
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//     teacherId String
//   }

const setTimetableProctor = async (req, res) => {
    const {day, subject, proctorId, period} = req.body;

    if(!day || !subject || !proctorId ) {
        return res.status(400).json({error: 'Invalid Data'});
    }

    // check if proctor exists
    const proctor = await prisma.teacher.findUnique({
        where: {
            id: proctorId
        }
    });

    if(!proctor) {
        return res.status(400).json({error: 'Proctor not found'});
    }

    // check if period is valid
    if(period < 0 || period > 8) {
        return res.status(400).json({error: 'Invalid Period'});
    }

    // check if that period already has a value in the timetable
    const isPeriod = await prisma.timetable.findFirst({
        where: {
            period : parseInt(period),
            day,
        }
    });

    if(isPeriod) {
        // update the period
        // delete the period
        try {
            const deletePeriod = await prisma.timetable.delete({
                where: {
                    id: isPeriod.id
                }
            });
        } catch (error) {
            res.status(500).json({error: 'Server Error', error});
        }

    }

    try {
        const timetable = await prisma.timetable.create({
            data: {
                period : parseInt(period),
                day,
                startTime : new Date(),
                endTime : new Date(),
                subject,
                teacherId: proctorId
            }
        });

        console.log(timetable);

        res.status(201).json(timetable);
    } catch (error) {
        res.status(500).json({error: 'Server Error', error});
    }
};







// export
export { 
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
};
