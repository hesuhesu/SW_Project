const express = require("express");
const router = express.Router();
const Board = require('../models/Board');

// 내 글 목록 조회 ======================================================================================================================
router.get("/my_board_list", async (req, res) => {
    try {
        const board = await Board.find({ writer : req.query.writer }).sort({ createdAt: -1 });
        res.json({ list: board });
    } catch (err) {
        res.json({ message: false });
    }
  });

// 내 글 목록 조회 ======================================================================================================================
router.get("/board_detail", async (req, res) => {
    try {
        const board = await Board.findOne({ _id : req.query._id });
        res.json({ list: board });
    } catch (err) {
        res.json({ message: false });
    }
  });

// 글 전체 목록 조회
router.get("/all_board_list", async(req, res) => {
    try {
        const board = await Board.find().sort({ createdAt: -1 });
        res.json({ list: board });
    } catch (error) {
        console.log(error);
        res.json({ message: false });
    }
});

// 게시글 작성 ======================================================================================================================
router.post("/write", async (req, res) => {
    try {
      let obj;
      obj = {
        writer: req.body._id,
        title: req.body.title,
        content: req.body.content,
        realContent: req.body.realContent
      };
      const board = new Board(obj);
      await board.save();
      res.json({ message: "게시글이 업로드 되었습니다." });
    } catch (err) {
      console.log(err);
      res.json({ message: false });
    }
  });

  // 게시글 상세보기 ======================================================================================================================
router.post("/detail", async(req,res) => {
    try {
        const _id = req.body._id;
        const board = await Board.find({_id});
        res.json({ board });
    } catch (error) {
        res.json({ message: false });
    }
});

 // 게시글 업데이트 ======================================================================================================================
router.put("/update", async (req,res) => {
    try {
        await Board.updateOne(
            {_id: req.body._id},
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content
                }
            }
        );
        res.json({ message : "게시글이 수정되었습니다." })
    } catch (error) {
        res.json({ message: false });
    }
});

 // 게시글 삭제 ======================================================================================================================
 router.delete("/delete", async(req,res) => {
     try {
        await Board.deleteOne({_id: req.query._id })
        res.json({ message: true });
     } catch (error) {
        res.json({ message: false });
     }
 });

 router.delete("/delete_user_all_board", async(req,res) => {
    try {
       await Board.deleteMany({writer: req.query.writer })
       res.json({ message: true });
    } catch (error) {
       res.json({ message: false });
    }
});

module.exports = router ;