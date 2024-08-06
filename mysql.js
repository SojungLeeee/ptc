

const mysql = require("mysql2/promise"); // Promise 기반 API를 사용

const dbInfo = {
    host: "localhost",  // 데이터베이스 주소
    port: 3306,         // 데이터베이스 포트
    user: "root",       // 로그인 계정
    password: "1234",   // 비밀번호
    database: "PKNU_DATA", // 엑세스할 데이터베이스
};

let pool; // 데이터베이스 연결 풀

module.exports = {
    init: function () {
        // 연결 풀 생성
        pool = mysql.createPool(dbInfo);
        return pool;
    },
    query: async function (sql, params) {
        // 쿼리 실행
        const [results, fields] = await pool.execute(sql, params);
        return [results, fields];
    },
    close: async function () {
        // 연결 풀 종료
        if (pool) {
            await pool.end();
        }
    },
};
