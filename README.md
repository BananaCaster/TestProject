# TestProject

Your shader is called once per vertex. Each time it's called you are required to set the the special global variable, gl_Position to some clipspace coordinates.

Vertex shaders need data. They can get that data in 3 ways.

Attributes (data pulled from buffers)
Uniforms (values that stay the same during for all vertices of a single draw call)
Textures (data from pixels/texels)
