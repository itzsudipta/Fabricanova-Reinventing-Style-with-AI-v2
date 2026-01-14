<p align="center">
  <img src="https://www.nit.ac.in/img/logo.png" alt="College Logo" width="220"/><br>
  <b style="font-size:2em;">Fabricanova : Reinventing Style with AI</b><br><br>
  <a href="https://your-live-demo-link.com"><b>Live</b></a> &nbsp; | &nbsp;
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"></a>
  <a href="https://github.com/NiT Kolkata/fabricanova-os/releases"><img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version"></a>
</p>

**The Neural Loom for Modern Fashion Design**

Fabricanova OS is an AI-powered platform for fashion designers, blending generative AI, technical sketching, and collaborative tools. Built with Next.js, React, and Python, it enables users to create, visualize, and iterate on garment designs from concept to technical vector sketches.

---

## Features

- **AI Fashion Studio**: Generate garment designs from text prompts and sketches using advanced diffusion models.
- **Interactive Canvas**: Draw, upload, and edit technical sketches with real-time feedback.
- **Modern UI**: Responsive, accessible, and visually appealing interface built with Tailwind CSS and React.

---

## Modern Tech Stack

| Category      | Technology & Icon                                                                                   | Purpose/Role                                 |
|---------------|-----------------------------------------------------------------------------------------------------|----------------------------------------------|
| **Frontend**  | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="24"/> Next.js <br> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="24"/> React | UI, Routing, SPA/SSR                         |
| **Styling**   | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="24"/> Tailwind CSS | Utility-first CSS framework                  |
| **Animation** | <img src="https://raw.githubusercontent.com/framer/logos/main/packages/logo/public/logo.svg" width="24"/> Framer Motion | UI Animations                                |
| **Icons**     | <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/brush.svg" width="24"/> lucide-react | Iconography                                  |
| **Backend**   | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="24"/> Python <br> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" width="24"/> FastAPI | AI model serving, API endpoints              |
| **AI/ML**     | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" width="24"/> PyTorch <br> <img src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" width="24"/> Diffusers <br> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" width="24"/> OpenCV <br> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="24"/> PIL | Generative models, image processing  |
| **Notebook**  | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" width="24"/> Jupyter Notebook | Model training, prototyping                  |
| **Deployment**| <img src="https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" width="24"/> Vercel <br> <img src="https://avatars.githubusercontent.com/u/31389823?s=200&v=4" width="24"/> ngrok | Hosting, tunneling AI endpoints              |
| **Versioning**| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="24"/> Git <br> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="24"/> GitHub | Source control, collaboration                |

---

## Directory Structure

```
.
├── aitrain.ipynb           # Jupyter notebook for AI model training and inference
├── geometry.py             # Geometry calculations for garment sketches
├── sketch.py               # SVG sketch generation script
├── design.json             # Example design data
├── fabricanovaOS/          # Main Next.js frontend app
│   ├── app/                # Application pages (Studio, Auth, Pricing, Team, etc.)
│   ├── component/          # Reusable React components
│   ├── public/             # Static assets
│   ├── ...                 # Config, build, and type files
├── fashionAI/              # Python virtual environment for AI backend
├── sketches/               # Generated or sample sketches
└── Readme.md               # Project documentation
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Python** (v3.8+)
- **CUDA GPU** (for AI model acceleration, optional but recommended)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-org/fabricanova-os.git
   cd fabricanova-os
   ```

2. **Frontend Setup:**
   ```sh
   cd fabricanovaOS
   npm install
   ```

3. **Backend (AI) Setup:**
   ```sh
   cd ..
   python3 -m venv fashionAI
   source fashionAI/bin/activate
   pip install -r requirements.txt
   ```

---

## Usage

### Start the Frontend

```sh
cd fabricanovaOS
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to access the app.

### Run AI Backend (Jupyter/Colab)

- Open `aitrain.ipynb` in Jupyter or Google Colab.
- Follow notebook instructions to start the AI server (usually exposes a `/generate` endpoint via ngrok).
- Paste the ngrok URL into the Studio’s AI Server Config panel.

---

## Meet Our Team 

<table>
  <tr>
    <td align="center">
      <img src="./fabricanovaOS/public/Team/SudiptaSakar.jpeg" width="80"/><br/>
      <b>Sudipta Sarkar</b><br/>
      Project Lead / Web & ML
    </td>
    <td align="center">
      <img src="./fabricanovaOS/public/Team/Avirup.jpeg" width="80"/><br/>
      <b>Avirup Guha Biswas</b><br/>
      Web Assist /Focus
    </td>
    <td align="center">
      <img src="./fabricanovaOS/public/Team/ReemaDas.jpeg" width="80"/><br/>
      <b>Reema Das</b><br/>
      Designer/UI&UX
    </td>
    <td align="center">
      <img src="./fabricanovaOS/public/Team/Swagslahiri.jpeg" width="80"/><br/>
      <b>Swagata Lahiri</b><br/>
      Designer and Tester/UI
    </td>
  </tr>
</table>

---

## Please Remember

**This project is developed strictly as an academic group major project and is intended solely for educational and research purposes. It is not designed, licensed, or intended for any commercial use**

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- Built in NiT Kolkata buy our team
- Powered by open-source ML and the global fashion tech community.
