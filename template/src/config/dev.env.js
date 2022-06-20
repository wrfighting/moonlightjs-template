/**
 * 开发环境配置项
 */

module.exports = {
    port: 3000,
    logToConsole: true,
{% if redis %}
    redis_options: {
        cluster: false,
            port: 6379, // Redis port
            host: '127.0.0.1', // Redis host
            family: 4, // 4 (IPv4) or 6 (IPv6)
            password: 'admin',
            db: 0,
            retryStrategy: function (times) {
            const delay = Math.min(times * 50, 2000)
            return delay
        },
    },
{% endif %}
{% if mysql %}
    mysql_options: {
        dataBase: 'json-controller-test',
            account: 'root',
            pwd: 'admin',
            options: {
            host: '127.0.0.1',
                port: 3306,
                dialect: 'mysql',
                //logging: false,
                dialectOptions: {
                charset: 'utf8mb4',
                    //collate: "utf8mb4_unicode_ci",
                    supportBigNumbers: true,
            },
            define: {
                charset: 'utf8mb4',
            },
            pool: {
                max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000,
            },
            timezone: '+08:00',
        },
    },
{% endif %}
}
