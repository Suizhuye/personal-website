#!/bin/bash
# ============================================
#  汪洢静个人网站 - GitHub Pages 部署脚本
#  使用方法: bash deploy.sh
# ============================================

set -e
echo "========================================="
echo "  🚀 开始部署到 GitHub Pages"
echo "========================================="

cd "$(dirname "$0")"

# Step 1: 登录 GitHub（如果未登录）
if ! gh auth status &>/dev/null; then
    echo ""
    echo "📌 第一步：登录 GitHub"
    echo "-----------------------------------------"
    echo "正在打开浏览器进行授权..."
    gh auth login --web --git-protocol https
fi

# 确认登录成功
echo ""
echo "✅ GitHub 登录状态："
gh auth status

# 获取用户名
GITHUB_USER=$(gh api user --jq '.login')
echo "👤 用户名: $GITHUB_USER"

# Step 2: 创建仓库
echo ""
echo "📌 第二步：创建 GitHub 仓库"
echo "-----------------------------------------"
if gh repo view "$GITHUB_USER/personal-website" &>/dev/null; then
    echo "ℹ️  仓库 $GITHUB_USER/personal-website 已存在，跳过创建"
else
    gh repo create personal-website \
        --public \
        --source=. \
        --push \
        --description "汪洢静 | 视觉传达设计师个人作品集网站" \
        --homepage "https://$GITHUB_USER.github.io/personal-website/"
    echo "✅ 仓库创建并推送成功！"
fi

# Step 3: 开启 GitHub Pages
echo ""
echo "📌 第三步：开启 GitHub Pages"
echo "-----------------------------------------"
gh api repos/$GITHUB_USER/personal-website/pages \
    -X POST \
    -f source='{"branch":"main","path":"/"}' \
    --silent && echo "✅ GitHub Pages 已启用！" || echo "⚠️  Pages 启用可能需要手动确认"

# Step 4: 显示结果
echo ""
echo "========================================="
echo "  ✨ 部署完成！"
echo "========================================="
echo ""
echo "🌐 你的网站地址："
echo "   https://$GITHUB_USER.github.io/personal-website/"
echo ""
echo "⏱️  首次部署可能需要 1-2 分钟生效"
echo "📝 后续更新只需：git add -A && git commit -m '更新' && git push"
echo ""
