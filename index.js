const express = require('express')
const app = express()
const port = 3000
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

(async () => {
  await Comments.sync( { force: true } )
  console.log("The table for the User model was just (re)created!")
})();


app.use(express.urlencoded( { extended: true } ))

app.set('view engine', 'ejs')

app.get('/', async (req, res) => {

  const comments = await Comments.findAll()
  res.render('index', { comments: comments })
})

app.post('/create', async (req, res) => {
  console.log(req.body)
  
  const { content } = req.body
  
  const comment = await Comments.create({ content: content })
  console.log(comment.id);

  res.redirect('/')

})

app.post('/update/:id', async (req, res) => {
  console.log(req.params)
  console.log(req.body)
  
  const { id } = req.params
  const { content } = req.body
  
  await Comments.update({ content: content }, {
    where: {
      id: id
    }
  })

  res.redirect('/')

})

// 삭제를 위한 라우팅 규칙은 변경할 내용이 없다는 것을 제외하면 수정과 유사합니다.
// 대상을 정하기 위한 id가 잘 지정되는지 유의합니다. 
app.post('/delete/:id', async (req, res) => {
  console.log(req.params)
  
  const { id } = req.params
  
  // 테이블의 데이터 중 파라미터의 id 값과 일치하는 것을 삭제합니다.
  // destroy({
  //   where: {
  //     id(컬럼): id(파라미터)
  //   }
  // })
  await Comments.destroy({
    where: {
      id: id
    }
  })

  res.redirect('/')

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})