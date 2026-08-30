import re

with open('d:/PROJECTS/Assembly Language/cpp_asm_data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hello cppCode
content = content.replace('cppCode: `#include <iostream>\n\nint main() {\n    std::cout << "Hello\\\\n";\n    return 0;\n}`',
                          'cppCode: `#include &lt;iostream&gt;\n\nint main() {\n    std::cout &lt;&lt; "Hello\\\\n";\n    return 0;\n}`')

# Replace arith cppCode
content = content.replace('cppCode: `int main() {\n    int a = 10;\n    a += 5;\n    a -= 2;\n    return a;\n}`',
                          'cppCode: `#include &lt;iostream&gt;\n\nint main() {\n    int a = 10;\n    a += 5;\n    a -= 2;\n    return a;\n}`')

# Replace cond cppCode
content = content.replace('cppCode: `int main() {\n    int pw = 42;\n    if (pw == 42) {\n        return 1;\n    }\n    return 0;\n}`',
                          'cppCode: `#include &lt;iostream&gt;\n\nint main() {\n    int pw = 42;\n    if (pw == 42) {\n        return 1;\n    }\n    return 0;\n}`')

# Replace loop cppCode
content = content.replace('cppCode: `int main() {\n    int sum = 0;\n    for(int i = 2; i > 0; i--) {\n        sum += i;\n    }\n    return sum;\n}`',
                          'cppCode: `#include &lt;iostream&gt;\n\nint main() {\n    int sum = 0;\n    for(int i = 2; i &gt; 0; i--) {\n        sum += i;\n    }\n    return sum;\n}`')

with open('d:/PROJECTS/Assembly Language/cpp_asm_data.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("cpp_asm_data.js updated!")
