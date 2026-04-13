import db from '../db.json';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const pkgName = parts[0];

  // Ищем пакет в db.json
  const library = db.libraries[pkgName as keyof typeof db.libraries];

  // 1. Сценарий ОШИБКИ (404)
  if (!library) {
    const errorResponse = {
      "status": "error",
      "error_code": 404,
      "message": "Library not found",
      "details": {
        "source": "dapz",
        "requested_name": pkgName || "none"
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 404,
      headers: { 'content-type': 'application/json' }
    });
  }

  // 2. Сценарий УСПЕХА
  const successResponse = {
    "status": "success",
    "data": {
      "found": true,
      "source": "dapz",
      "library": {
        "name": pkgName,
        "version": library.version,
        "description": library.description,
        "download_url": library.download_url
      }
    }
  };

  return new Response(JSON.stringify(successResponse), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
}
