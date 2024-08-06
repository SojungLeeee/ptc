

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const db = require("./mysql"); // 수정된 mysql.js 모듈

const app = express();

const port = process.env.PORT || 3030;
const host = process.env.HOST || "https://port-0-ptc-lxn0e9ec59e35a43.sel5.cloudtype.app/";



db.init(); // 데이터베이스 연결 풀 초기화

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors()); // CORS를 전체로 허용하도록 설정

// 정적 파일 제공
// app.use(express.static(path.join(__dirname, 'js')));


// app.use('/css', express.static(path.join(__dirname, '/css')));
// app.use('/config', express.static(path.join(__dirname, '/config')));
// app.use('/fonts', express.static(path.join(__dirname, '/fonts')));
// app.use('/images', express.static(path.join(__dirname, '/images')));
app.use('/js', express.static(path.join(__dirname, '/js')));


// 기본 라우트 설정
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 기본 라우트 설정
app.get('/bring.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'bring.html'));
});

// 데이터 가져오기 엔드포인트 추가
app.get('/fetchData', async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM TESTTABLE");
        res.json(results); // 결과를 배열 형태로 반환
    } catch (err) {
        console.error("Query execution error:", err);
        res.status(500).send("Database error");
    }
});



// 게시글 목록 보기
app.get("/view", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM TESTTABLE");
        res.send(results);
    } catch (err) {
        console.error("Query execution error:", err);
        res.status(500).send("Database error");
    }
});

// 폼 데이터 처리 엔드포인트
app.post('/submit', async (req, res) => {
    let { inputName, inputGender, inputStudentnumber, inputPhone, inputAge, inputMajor } = req.body;

    // undefined 값을 null로 변환
    inputName = inputName || null;
    inputGender = inputGender || null;
    inputStudentnumber = inputStudentnumber || null;
    inputPhone = inputPhone || null;
    inputAge = inputAge || null;
    inputMajor = inputMajor || null;

    const query = 'INSERT INTO testtable (name, gender, studentnum, phone, age, major, writedate) VALUES (?, ?, ?, ?, ?, ?, now())';

    try {
        await db.query(query, [inputName, inputGender, inputStudentnumber, inputPhone, inputAge, inputMajor]);
        res.send('정보가 저장되었습니다.');
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Database error');
    }
});

// 서버 동작중인 표시
app.listen(port, host, () =>
    console.log(`Server is running on http://${host}:${port}`)
);

// 서버 종료 시 데이터베이스 연결 종료
process.on('SIGINT', async () => {
    await db.close();
    process.exit();
});


