module.exports = (req, res, next) => {
    console.log('hit checkUser')
    if(req.session.user) {
        return res.status(200).send(req.session.user)
    } else {
        next()
    }
}