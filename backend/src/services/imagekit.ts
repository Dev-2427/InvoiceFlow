import Imagekit from "imagekit";
import { env } from "../config/env.js";

const imagekit = new Imagekit({
    publicKey: env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: env.IMAGEKIT_URL_ENDPOINT!
})

export default imagekit