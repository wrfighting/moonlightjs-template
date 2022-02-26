/**
 * 自定义异常
 */

module.exports = function (str) {
    var err = new Error(str)
    err.myError = true
    err.myType = 1 //1为业务标志
    return err
}
