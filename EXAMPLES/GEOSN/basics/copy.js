constfs=require("fs");
constzlib=require("zlib");
const{Transform}=require("stream");

constremoveSpaces=newTransform({
transform(chunk,encoding,callback){
callback(null,String(chunk).replaceAll("",""));
},
});

constreaderStream=fs.createReadStream("streams.js");

readerStream.on("data",(chunk)=>{
console.log(chunk.toString("utf-8"));
});

readerStream.on("end",()=>{
console.log("end");
});

readerStream.on("error",(error)=>{
console.error({error});
});

constwriterStream=fs.createWriteStream("copy.js");
readerStream.pipe(removeSpaces).pipe(writerStream);

constzipStream=zlib.createGzip();
constzipWriterStream=fs.createWriteStream("copy.zip");

readerStream.pipe(zipStream).pipe(zipWriterStream);
