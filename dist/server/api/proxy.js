import express from 'express';
import fetch from 'isomorphic-fetch';

const router = express.Router();

// could use fetch and promises - use async/await
/*
 fetch('https://api.github.com/gists')
 .then(response => response.json().then(data => ({data, response})))
 .then(data => res.json(data));
*/

router.get('/gists', (req, res) => {
  (async () => {
    const remote = await fetch('https://api.github.com/gists');
    remote.gists = await remote.json();
    res.json({data: remote.gists});
  })();
});

export default router;