import os
import shutil

print("=== ORGANIZADOR DE ARQUIVOS ===")

pasta = input("Digite o caminho da pasta que deseja organizar: ").strip()

if not os.path.isdir(pasta):
    print("❌ Pasta inválida.")
    exit()

tipos = {
    "Imagens": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    "Videos": [".mp4", ".mkv", ".avi", ".mov"],
    "Documentos": [".pdf", ".docx", ".doc", ".txt", ".xlsx", ".pptx"],
    "Compactados": [".zip", ".rar", ".7z"],
    "Executaveis": [".exe", ".msi"],
    "Outros": []
}

for arquivo in os.listdir(pasta):
    caminho_arquivo = os.path.join(pasta, arquivo)

    if os.path.isfile(caminho_arquivo):
        movido = False
        extensao = os.path.splitext(arquivo)[1].lower()

        for categoria, extensoes in tipos.items():
            if extensao in extensoes:
                destino = os.path.join(pasta, categoria)
                os.makedirs(destino, exist_ok=True)
                shutil.move(caminho_arquivo, os.path.join(destino, arquivo))
                movido = True
                break

        if not movido:
            destino = os.path.join(pasta, "Outros")
            os.makedirs(destino, exist_ok=True)
            shutil.move(caminho_arquivo, os.path.join(destino, arquivo))

print("✅ Organização concluída!")
