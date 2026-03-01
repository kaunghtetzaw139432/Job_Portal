export const post = (req, res) => {
    const { name } = req.body
    console.log("Received Name:", name);
    return res.status(200).send(`Your name is ${name}`)
}
