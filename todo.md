# Beat Lab — TODO

## Add TR-909 / TR-606 / Linn Drum samples (manual step)

The code is wired up and ready. You just need to download the samples and drop them in:

### TR-909
- Source: BPB Cassette 909 — https://bedroomproducersblog.com/free-download/
- Destination: `public/samples/tr-909/`
- Files needed (rename to match): `kick.wav`, `snare.wav`, `clap.wav`, `hihat-close.wav`, `hihat-open.wav`, `cymbal.wav`, `rimshot.wav`, `tom-hi.wav`, `tom-low.wav`

### TR-606
- Source: BPB Cassette 606 — https://bedroomproducersblog.com/2014/03/13/free-606-samples/
- Destination: `public/samples/tr-606/`
- Files needed: `kick.wav`, `snare.wav`, `hihat-close.wav`, `hihat-open.wav`, `cymbal.wav`, `tom-hi.wav`, `tom-low.wav`

### Linn Drum (public domain)
- Source: oramics/sampled — https://github.com/oramics/sampled (LM-2 subfolder)
- Destination: `public/samples/linn-drum/`
- Files needed: `kick.wav`, `snare.wav`, `clap.wav`, `hihat-close.wav`, `hihat-open.wav`, `cymbal.wav`, `cowbell.wav`, `conga-hi.wav`, `conga-low.wav`, `tom-hi.wav`, `tom-low.wav`

Missing files are skipped gracefully — only the sounds you actually provide will work.
