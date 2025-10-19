from livereload import Server
import os


def main() -> None:
    project_root = os.path.dirname(__file__)
    root_dir = os.path.join(project_root, "company-profile", "sahaltech.com")

    server = Server()
    # Watch common asset paths for changes
    server.watch(os.path.join(root_dir, "*.html"))
    server.watch(os.path.join(root_dir, "css", "*.css"))
    server.watch(os.path.join(root_dir, "js", "*.js"))

    # Serve with live reload enabled
    server.serve(root=root_dir, host="0.0.0.0", port=5500)


if __name__ == "__main__":
    main()
