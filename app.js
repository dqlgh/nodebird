const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const csrf = require('csurf');
const redis = require('redis');
const RedisStore = require('connect-redis').default;


dotenv.config();

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}`,
    password: process.env.REDIS_PASSSWORD,
    legacyMode: true,
});
redisClient.connect().catch(console.error);

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const { sequelize } = require('./models');
const passportConfig = require('./passport');
const logger = require('./logger');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});


sequelize.sync({ force: false }) // sequelize.sync({ force: true }) => 테이블을 잘못만들었을 경우 기존 테이블 삭제후 다시 만든다.
    .then(() => {
        console.log('데이터 베이스 연결되었다.')
    })
    .catch((err) => {
        console.error(err);
    })


if (process.env.NODE_ENV === 'production') {
    app.enable('trust proxy');
    app.use(morgan('combined'));
    app.use(helmet({ 
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
    }));
    app.use(hpp());
} else {
    app.use(morgan('dev'));
};
app.use(express.static(path.join(__dirname, 'public')))
app.use('/img', express.static(path.join(__dirname, 'uploads')))
app.use('/favicon.ico', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(csrf({ cookie: true }))

const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    store: new RedisStore({ client: redisClient }),
}
if (process.env.NODE_ENV === 'production') {
    sessionOption.proxy = true;
    // sessionOption.cookie.secure = true; // https를 적용한 경우 주석을 해제한다.
}
app.use(session(sessionOption));
// 반드시 session 밑에 passport미들웨어를 붙여야 한다.
app.use(passport.initialize()); // req.login(), req.logout(), req.user, req.isAuthenticate 여기서 이런것들이 생긴다.
app.use(passport.session()); // connect.sid라는 이름으로 세션 쿠키가 브라우저로 전송

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);


app.use((req, res, next) => {
    const error = new Error(`${req.params} ${req.url} 라우트가 없습니다.`)
    error.status = 404;
    logger.info('hello');
    logger.error(error.message);
    next(error);
})

app.use((err, req, res, next) => {
    // if (err.code !== 'EBADCSRFTOKEN') return next(err);
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 에러로그를 처리하는 전문서비스에 넘긴다.
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;



