import { auth } from "@/lib/auth";
import { gmail } from "@googleapis/gmail";
import { NextResponse } from "next/server";

type QueryParams = {
  id: string;
};

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: QueryParams;
  }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q');
    const maxResults = searchParams.get('maxResults') || '10';
    
    console.log("Gmail API - GET Request:", {
      id,
      searchParams: Object.fromEntries(searchParams),
      query: q,
      maxResults
    });
    
    const session = await auth();

    if (!session) {
      console.error("Gmail API - Authentication failed: No session found");
      return new NextResponse(
        JSON.stringify({ status: "fail", message: "You are not logged in" }),
        { status: 401 }
      );
    }

    if (!session.user?.token?.access_token) {
      console.error("Gmail API - Authentication failed: No access token found in session");
      return new NextResponse(
        JSON.stringify({ status: "fail", message: "No access token available" }),
        { status: 401 }
      );
    }

    const access_token = session.user.token.access_token;
    console.log("Gmail API - Using access token (first 20 chars):", access_token.substring(0, 20) + "...");

    const emailList = await gmail("v1").users.messages.list({
      userId: "me",
      oauth_token: access_token,
      pageToken: id === "null" ? "0" : id,
      q: q || undefined,
      maxResults: parseInt(maxResults),
    });

    console.log("Gmail API - Email list response:", {
      resultSizeEstimate: emailList.data.resultSizeEstimate,
      messagesCount: emailList.data.messages?.length || 0,
      nextPageToken: emailList.data.nextPageToken
    });

    if (!emailList.data.messages) {
      console.warn("Gmail API - No messages found in response");
      return new NextResponse(
        JSON.stringify({ status: "fail", message: "No emails found" }),
        { status: 404 }
      );
    }

    const emails = [];
    console.log("Gmail API - Fetching individual email details for", emailList.data.messages.length, "messages");

    const emailPromises = emailList.data.messages.map((message, index) => {
      const emailMessageId = message.id as string;
      console.log(`Gmail API - Fetching message ${index + 1}/${emailList.data.messages!.length}:`, emailMessageId);
      return gmail("v1").users.messages.get({
        id: emailMessageId,
        userId: "me",
        oauth_token: access_token,
      });
    });

    const emailResults = await Promise.all(emailPromises);
    emails.push(...emailResults);

    console.log("Gmail API - Successfully fetched", emails.length, "email details");

    return NextResponse.json({
      meta: emailList.data,
      data: emails,
    });
  } catch (error) {
    console.error("Gmail API - Error in GET /api/gmail/[id]:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      params,
      timestamp: new Date().toISOString()
    });

    return new NextResponse(
      JSON.stringify({ 
        status: "error", 
        message: "Internal server error while fetching emails",
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    );
  }
}
