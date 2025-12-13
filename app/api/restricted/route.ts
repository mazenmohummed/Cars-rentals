import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    return Response.json(
      {
        content:
          "This is protected content. You can access this content because you are signed in.",
      },
      { status: 200 }
    );
  }

  return Response.json(
    {
      error:
        "You must be signed in to view the protected content on this page.",
    },
    { status: 401 }
  );
}
