import api from "./api";

export async function addMedia(files) {
    const media = [];
    for (let file of files) {
        const form = new FormData();
        form.append("files", file);

        try {
            const response = await api.post("posts/upload", form);
            const data = response.data;
            const url = data.url.data.path;
            media.push({
                type: file.type.startsWith("video") ? "video" : "image",
                preview: "https://hhccbekozmwipzovsnkk.supabase.co/storage/v1/object/public/hivemind_posts/" + url,
                storagePath: "https://hhccbekozmwipzovsnkk.supabase.co/storage/v1/object/public/hivemind_posts/" + url
            })
        } catch (error) {
            alert(error);
            return [];
        }

    }
    return media;
}