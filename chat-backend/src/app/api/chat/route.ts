import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant for a chat widget. Keep responses concise and helpful."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const aiResponse = response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

        return NextResponse.json({
            success: true,
            response: aiResponse
        });

    } catch (error) {
        console.error('OpenAI API error:', error);
        return NextResponse.json({
            error: 'Failed to get AI response',
            success: false
        }, { status: 500 });
    }
}

// Enable CORS for the widget
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
} 