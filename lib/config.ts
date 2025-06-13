const config = {
    env: {
        apiEndPoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
        imageKit:{
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
            urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!
        },
        databaseUrl: process.env.DATABASE_URL
    }
}

export default config;