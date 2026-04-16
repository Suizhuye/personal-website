#!/bin/bash
# ============================================
#  汪洢静个人网站 - GitHub Pages 部署脚本 (非交互版)
#  使用方法: bash deploy-quiet.sh
#  前置: 需要先在终端执行一次 gh auth login --web
# ============================================

set -e

cd "$(dirname "$0")"

echo "========================================="
echo "  🚀 部署到 GitHub Pages"
echo "========================================="

# 检查登录状态
if ! gh auth status &>/dev/null; then
    echo ""
    echo "❌ 还未登录 GitHub！请先运行："
    echo ""
    echo "   gh auth login --web"
    echo ""
    echo "然后在弹出的浏览器中输入验证码并授权。"
    echo "完成后再重新运行本脚本。"
    exit 1
fi

# 获取用户名
GITHUB_USER=$(gh api user --jq '.login')
echo "✅ 已登录为: $GITHUB_USER"

# 创建仓库（如果不存在）
REPO="$GITHUB_USER/personal-website"
if gh repo view "$REPO" &>/dev/null; then
    echo "ℹ️  仓库 $REPO 已存在，跳过创建"
else
    echo "📦 正在创建仓库..."
    gh repo create personal-website \
        --public \
        --source=. \
        --push \
        --description "汪洢静 | 视觉传达设计师个人作品集网站" \
        --homepage "https://$GITHUB_USER.github.io/personal-website/"
fi

# 开启 Pages
echo "⏳ 正在启用 GitHub Pages..."
gh api repos/$GITHUB_USER/personal-website/pages \
    -X POST \
    -f source='{"branch":"main","path":"/"}' \
    --silent && echo "✅ Pages 启用成功！" || {
    echo "⚠️  Pages 可能需要手动开启"
    echo "   请访问: https://github.com/$GITHUB_USER/personal-website/settings/pages"
}

echo ""
echo "========================================="
echo "  ✨ 部署成功！"
echo "========================================="
echo ""
echo "🌐 你的网站地址："
echo "   https://$GITHUB_USER.github.io/personal-website/"
echo ""
echo "⏱️  首次部署可能需要 1-2 分钟生效"
