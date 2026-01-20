import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

export default function remarkFigure() {
    return (tree) => {
      visit(tree, (node) => {
        if (node.type === 'image') {
          console.log("node type", node.type)
          console.log("node", node)
        }
      })
    }
}    