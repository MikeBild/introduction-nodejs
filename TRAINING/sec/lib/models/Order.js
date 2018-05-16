module.exports = class Order {
  constructor(id, sampleId, dns, start, end, status) {
    this.id = id;
    this.sampleId = sampleId;
    this.dns = dns;
    this.start = start;
    this.end = end;
    this.status = status || "INITIAL";
  }
};
