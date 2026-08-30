import re
import json

def port_fundamental():
    with open('d:/PROJECTS/Assembly Language/cpp_vs_asm_guide.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Extract the main container HTML (inside body but before script tags)
    start = html.find('<div class="main-container">')
    end = html.find('<!-- SCRIPTS -->')
    if end == -1:
        end = html.find('<script>')
        
    template_content = html[start:end]
    
    # In Vue, onclick="switchTab('fund', this)" must be converted to @click="switchTab('fund')" 
    # but since this is just a quick port, I can either just copy the HTML and do it, or I can build a proper Vue component.
    # The user asked: "bantu inisalisasi projek baru Vue.JS dengan nama AssemblyLanguage lalu salin aturan penggunaan css dan javascript... dengan tambahan route ke halaman Fundamental.vue (hasil porting halaman cpp_vs_asm_guide.html)".
    
    # Let's write the Vue component
    with open('d:/PROJECTS/Assembly Language/cpp_asm_data.js', 'r', encoding='utf-8') as f:
        js_data = f.read()
        js_data = js_data.replace('const animDb = {', 'const animDb = {')
        
    # We will just write a wrapper component that renders raw HTML or implements the logic natively.
    # A full native Vue rewrite takes more time but is better.
    pass

port_fundamental()
