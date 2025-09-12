import { auth } from "@/lib/auth";
import { gmail } from "@googleapis/gmail";
import { NextResponse } from "next/server";

type QueryParams = {
  id: string;
  messageId: string;
};

/**
 * Deletes a Gmail message specified by the messageId parameter.
 *
 * @param req - The request object.
 * @param params - An object containing the query parameters.
 * @param params.messageId - The ID of the message to be deleted.
 * @returns A NextResponse object indicating the result of the delete operation.
 *
 * @remarks
 * - Requires the user to be authenticated.
 * - If the user is not authenticated, returns a 401 status with a failure message.
 * - Uses the Gmail API to delete the specified message.
 * - If the deletion is successful, returns a success message and the data from the Gmail API.
 */
export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: QueryParams;
  }
) {
  try {
    const { messageId } = params;
    const session = await auth();

    console.log("Gmail Delete API - DELETE Request:", {
      messageId,
      timestamp: new Date().toISOString()
    });

    if (!session) {
      console.error("Gmail Delete API - Authentication failed: No session found");
      return new NextResponse(
        JSON.stringify({ status: "fail", message: "You are not logged in" }),
        { status: 401 }
      );
    }

    if (!session.user?.token?.access_token) {
      console.error("Gmail Delete API - Authentication failed: No access token found in session");
      return new NextResponse(
        JSON.stringify({ status: "fail", message: "No access token available" }),
        { status: 401 }
      );
    }

    const access_token = session.user.token.access_token;
    console.log("Gmail Delete API - Using access token (first 20 chars):", access_token.substring(0, 20) + "...");

    console.log("Gmail Delete API - Attempting to delete message:", messageId);
    
    const data = await gmail("v1").users.messages.delete(
      {
        userId: "me",
        oauth_token: access_token,
        id: messageId,
      }
    );

    console.log("Gmail Delete API - Message deleted successfully:", {
      messageId,
      responseData: data.data,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      status: "success",
      message: "Email deleted successfully",
      data: data
    });
  } catch (error) {
    console.error("Gmail Delete API - Error in DELETE /api/gmail/messages/[messageId]:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      messageId: params.messageId,
      timestamp: new Date().toISOString()
    });

    return new NextResponse(
      JSON.stringify({ 
        status: "error", 
        message: "Internal server error while deleting email",
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: QueryParams;
  }
) {
  try {
    const { messageId } = params;
    const session = await auth();

    console.log("Gmail Delete API - POST Request:", {
      messageId,
      timestamp: new Date().toISOString()
    });

    if (!session) {
      console.error("Gmail Delete API - Authentication failed: No session found");
      return new NextResponse(
        JSON.stringify({ status: "fail", message: "You are not logged in" }),
        { status: 401 }
      );
    }

    if (!session.user?.token?.access_token) {
      console.error("Gmail Delete API - Authentication failed: No access token found in session");
      return new NextResponse(
        JSON.stringify({ status: "fail", message: "No access token available" }),
        { status: 401 }
      );
    }

    const access_token = session.user.token.access_token;
    console.log("Gmail Delete API - Using access token (first 20 chars):", access_token.substring(0, 20) + "...");

    console.log("Gmail Delete API - Attempting to delete message via POST:", messageId);
    
    const data = await gmail("v1").users.messages.delete(
      {
        userId: "me",
        oauth_token: access_token,
        id: messageId,
      }
    );

    console.log("Gmail Delete API - Message deleted successfully via POST:", {
      messageId,
      responseData: data.data,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      status: "success",
      message: "Email deleted successfully",
      data: data
    });
  } catch (error) {
    console.error("Gmail Delete API - Error in POST /api/gmail/messages/[messageId]:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      messageId: params.messageId,
      timestamp: new Date().toISOString()
    });

    return new NextResponse(
      JSON.stringify({ 
        status: "error", 
        message: "Internal server error while deleting email",
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    );
  }
}
