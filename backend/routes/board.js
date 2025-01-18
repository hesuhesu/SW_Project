const express = require("express");
const router = express.Router();
const Board = require('../models/Board');
const { authenticateToken } = require('./auth');

// 내 글 목록 조회 ======================================================================================================================
router.get("/my_board_list", authenticateToken, async (req, res) => {
    try {
        const board = await Board.find({ writer : req.query.writer }).sort({ createdAt: -1 });
        res.json({ list: board });
    } catch (err) {
        res.json({ message: false });
    }
  });

// 글 상세 조회 ======================================================================================================================
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
router.post("/write", authenticateToken, async (req, res) => {
    try {
      let obj;
      const now = new Date();
      const createdAt = now.toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
      });
      obj = {
        writer: req.body.writer,
        title: req.body.title,
        content: req.body.content,
        realContent: req.body.realContent,
        imgData: req.body.imgData,
        threeD: req.body.threeD,
        threeDTrue: req.body.threeDTrue,
        createdAt: createdAt
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
router.put("/update", authenticateToken, async (req,res) => {
    try {
        
        await Board.updateOne(
            {_id: req.body._id},
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    realContent: req.body.realContent,
                    imgData: req.body.imgData,
                    threeD: req.body.threeD,
                    threeDTrue: req.body.threeDTrue
                }
            }
        );
        res.json({ message : "게시글이 수정되었습니다." })
    } catch (error) {
        res.json({ message: false });
    }
});

 // 게시글 삭제 ======================================================================================================================
 router.delete("/delete", authenticateToken, async(req,res) => {
     try {
        await Board.deleteOne({_id: req.query._id })
        res.json({ message: true });
     } catch (error) {
        res.json({ message: false });
     }
 });

 // 계정 삭제 시 전체 게시물 삭제
 router.delete("/delete_user_all_board", authenticateToken, async(req,res) => {
    try {
       await Board.deleteMany({writer: req.query.writer })
       res.json({ message: true });
    } catch (error) {
       res.json({ message: false });
    }
});

module.exports = router ;