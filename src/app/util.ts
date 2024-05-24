export function emitForData(ev: string, data: any): any {
  return new Promise((res) => {
    socket.emit(ev, data, (d: any) => res(d));
  });
}
