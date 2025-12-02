export function ok(data: any) {
  return Response.json({ success: true, data });
}

export function fail(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status });
}
