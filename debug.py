import os
import json
import tkinter as tk
from tkinter import ttk, messagebox
from pathlib import Path

IGNORE_FILENAME = "debugIgnore.json"

class FileSelectorApp:
    def __init__(self, root_folder: Path):
        self.root_folder = root_folder
        self.ignore_file = self.root_folder / IGNORE_FILENAME
        self.ignored_paths = self.load_ignored_paths()

        self.root = tk.Tk()
        self.root.title("File Selection for Export")
        self.root.geometry("800x600")

        style = ttk.Style(self.root)
        style.configure("Treeview", font=('Segoe UI', 14), rowheight=34)

        # ➕ Export header input
        self.header_text = tk.Text(self.root, height=5, font=('Segoe UI', 12))
        self.header_text.pack(fill=tk.X, padx=10, pady=(10, 5))

        self.tree = ttk.Treeview(
            self.root,
            columns=("check", "path"),
            show='tree',
            displaycolumns=("check",)
        )
        self.tree.column("check", width=40, anchor='center', stretch=False)
        self.tree.column("path", width=0, stretch=False)
        self.tree.pack(fill=tk.BOTH, expand=True)

        btn_frame = tk.Frame(self.root)
        btn_frame.pack(fill=tk.X)
        tk.Button(btn_frame, text="Select All", command=self.select_all).pack(side=tk.LEFT, padx=5, pady=5)
        tk.Button(btn_frame, text="Unselect All", command=self.unselect_all).pack(side=tk.LEFT, padx=5, pady=5)
        tk.Button(btn_frame, text="Export Selected", command=self.export_selected).pack(side=tk.RIGHT, padx=5, pady=5)
        tk.Button(btn_frame, text="Config", command=self.open_configurator).pack(side=tk.RIGHT, padx=5, pady=5)

        self.check_states = {}
        self.build_tree()
        self.tree.bind('<Button-1>', self.on_click)

    def load_ignored_paths(self):
        if self.ignore_file.exists():
            try:
                return set(json.loads(self.ignore_file.read_text(encoding='utf-8')))
            except Exception:
                return set()
        return set()

    def save_ignored_paths(self, paths: set):
        with open(self.ignore_file, 'w', encoding='utf-8') as f:
            json.dump(sorted(paths), f, indent=2)

    def is_ignored(self, path: Path):
        return str(path) in self.ignored_paths

    def build_tree(self):
        self.tree.delete(*self.tree.get_children())
        root_id = self.insert_item('', self.root_folder.name, self.root_folder, checked=not self.is_ignored(self.root_folder))
        self.populate_subtree(root_id, self.root_folder)

    def populate_subtree(self, parent_id, folder: Path):
        for item in sorted(folder.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower())):
            if self.is_ignored(item):
                continue
            item_id = self.insert_item(parent_id, item.name, item, checked=True)
            if item.is_dir():
                self.populate_subtree(item_id, item)

    def insert_item(self, parent, name: str, path: Path, checked: bool) -> str:
        symbol = '☑' if checked else '☐'
        item_id = self.tree.insert(parent, tk.END, text=name, values=(symbol, str(path)))
        self.check_states[item_id] = checked
        return item_id

    def on_click(self, event):
        region = self.tree.identify_region(event.x, event.y)
        col = self.tree.identify_column(event.x)
        if region != 'cell' or col != '#1':
            return
        item_id = self.tree.identify_row(event.y)
        if not item_id:
            return
        new_state = not self.check_states.get(item_id, False)
        self.set_state_recursive(item_id, new_state)

    def set_state_recursive(self, item_id, state: bool):
        symbol = '☑' if state else '☐'
        self.tree.set(item_id, 'check', symbol)
        self.check_states[item_id] = state
        for child in self.tree.get_children(item_id):
            self.set_state_recursive(child, state)

    def select_all(self):
        for item_id in self.tree.get_children(''):
            self.set_state_recursive(item_id, True)

    def unselect_all(self):
        for item_id in self.tree.get_children(''):
            self.set_state_recursive(item_id, False)

    def export_selected(self):
        output_path = self.root_folder / "output_debug.txt"
        try:
            with open(output_path, 'w', encoding='utf-8') as outfile:
                # ➕ Write header content first
                header_content = self.header_text.get("1.0", tk.END).strip()
                if header_content:
                    outfile.write(header_content + "\n\n")

                for item_id, checked in self.check_states.items():
                    if not checked:
                        continue
                    path = Path(self.tree.set(item_id, 'path'))
                    if path.is_file() and not self.is_ignored(path):
                        outfile.write(f"----- Content from: {path} -----\n")
                        try:
                            with open(path, 'r', encoding='utf-8') as infile:
                                outfile.write(infile.read())
                        except Exception as e:
                            outfile.write(f"Error reading file: {e}\n")
                        outfile.write("\n\n")
            os.startfile(str(output_path))
        except Exception as e:
            messagebox.showerror("Error", f"Failed to write or open file: {e}")

    def open_configurator(self):
        config_win = tk.Toplevel(self.root)
        config_win.title("Ignore Configuration")
        config_win.geometry("600x500")
        tree = ttk.Treeview(config_win, columns=("check", "path"), show='tree', displaycolumns=("check",))
        tree.column("check", width=40, anchor='center', stretch=False)
        tree.column("path", width=0, stretch=False)
        tree.pack(fill=tk.BOTH, expand=True)
        state_map = {}

        def insert_config_item(parent, name: str, path: Path, checked: bool) -> str:
            symbol = '☑' if checked else '☐'
            item_id = tree.insert(parent, tk.END, text=name, values=(symbol, str(path)))
            state_map[item_id] = checked
            return item_id

        def populate_tree(parent_id, folder: Path):
            for item in sorted(folder.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower())):
                checked = str(item) not in self.ignored_paths
                item_id = insert_config_item(parent_id, item.name, item, checked)
                if item.is_dir():
                    populate_tree(item_id, item)

        root_id = insert_config_item('', self.root_folder.name, self.root_folder, checked=str(self.root_folder) not in self.ignored_paths)
        populate_tree(root_id, self.root_folder)

        def set_state_recursive_config(item_id, state: bool):
            symbol = '☑' if state else '☐'
            tree.set(item_id, 'check', symbol)
            state_map[item_id] = state
            for child in tree.get_children(item_id):
                set_state_recursive_config(child, state)

        def toggle_config(event):
            region = tree.identify_region(event.x, event.y)
            col = tree.identify_column(event.x)
            if region != 'cell' or col != '#1':
                return
            item_id = tree.identify_row(event.y)
            if not item_id:
                return
            new_state = not state_map.get(item_id, False)
            set_state_recursive_config(item_id, new_state)

        def save_config():
            ignored = set()
            for item_id, checked in state_map.items():
                if not checked:
                    path = Path(tree.set(item_id, 'path'))
                    ignored.add(str(path))
            self.save_ignored_paths(ignored)
            self.ignored_paths = ignored
            config_win.destroy()
            self.build_tree()

        tree.bind('<Button-1>', toggle_config)
        tk.Button(config_win, text="Save Ignore List", command=save_config).pack(pady=5)

    def run(self):
        self.root.mainloop()

if __name__ == '__main__':
    base_folder = Path(__file__).parent
    app = FileSelectorApp(base_folder)
    app.run()
