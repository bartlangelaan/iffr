const upSince = new Date().getTime();

function status() {
  return {
    upSince,
    status: 'OK',
    time: new Date().getTime(),
  };
}

export default status;
