use base64::{Engine, engine::general_purpose};

mod ffhelp;

#[tauri::command]
fn get_frame(idx: usize) -> String {
    // TODO: call ffhelp frame index
    let (w, h, p) = (0, 0, vec![]);

    let mut buf = Vec::new();
    {
        let img = image::RgbImage::from_raw(w, h, p).unwrap();
        img.write_to(&mut std::io::Cursor::new(&mut buf), image::ImageFormat::Png).unwrap();
    }

    general_purpose::STANDARD.encode(buf)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_frame])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
