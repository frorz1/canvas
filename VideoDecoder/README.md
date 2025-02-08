## 流程

1. 加载 video 资源

```js
fetch("./rains-s.mp4")
.then((res) => res.arrayBuffer())
.then((buffer) => {
  buffer.fileStart = 0;
  mp4Box.appendBuffer(buffer);
  mp4Box.flush();
  // mp4Box的流程为 onReady -> onSamples -> samples.forEach(() => { videoDecoder.decode(chunk) -> videoDecoder.flush() -> output }) 拿到 videoFrames
});
```

2. 触发 mp4box.onReady

可以拿到视频信息，如 tracks, width, height, nb_samples(样本数量) 等, 可以在这里初始化 `VideoDecoder` 解码器
```js
mp4Box.onReady = function (info) {
  videoTrack = info.tracks[0];
  if (videoTrack !== null) {
    mp4Box.setExtractionOptions(videoTrack.id, "video", {
      nbSamples: 100,
    });
  }

  const videoW = videoTrack.track_width;
  const videoH = videoTrack.track_height;

  videoDecoder = new VideoDecoder({
    output: (videoFrame) => {
      createImageBitmap(videoFrame).then((img) => {
        videoFrames.push({
          img,
          duration: videoFrame.duration,
          timestamp: videoFrame.timestamp,
        });
        videoFrame.close();
      });
    },
    error: (error) => {
      console.error("videoDecoder错误: ", err);
    },
  });

  nbSamplesTotal = videoTrack.nb_samples;

  videoDecoder.configure({
    codec: videoTrack.codec,
    codedWidth: videoW,
    codedHeight: videoH,
    description: getExtradata(),
  });

  mp4Box.start();
};
```

3. 触发 mp4box.onSample
可以拿到具体的样本数据，根据样本数据，调用 `EncodedVideoChunk` 合成块，然后将 chunk 加入到 videoDecoder 中解码
```js
mp4Box.onSamples = function (trackId, user, samples) {
  if (videoTrack.id === trackId) {
    mp4Box.stop();

    countSample += samples.length;

    for (const sample of samples) {
      const type = sample.is_sync ? "key" : "delta";
      const chunk = new EncodedVideoChunk({
        type,
        timestamp: sample.cts,
        duration: sample.duration,
        data: sample.data,
      });

      videoDecoder.decode(chunk);
    }
    if (countSample === nbSamplesTotal) {
      console.log("flush");
      videoDecoder.flush();
    }
  }
};
```
4. 触发 output
当 videoDecoder 有结果时，会触发 VideoDecoder 初始化时的 output 函数。 触发次数是有 onSample 回调中向 videoDecoder 添加了多少 `EncodedVideoChunk` 决定的。output 的结果就是视频帧了。

```js
output: (videoFrame) => {
  createImageBitmap(videoFrame).then((img) => {
    videoFrames.push({
      img,
      duration: videoFrame.duration,
      timestamp: videoFrame.timestamp,
    });
    videoFrame.close();
  });
},
```

## 应用

我们做一些方法，如 seek 到第几帧、每 1s 抽一帧等
