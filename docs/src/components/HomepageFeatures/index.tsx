import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Fully Customizable UI',
    Svg: require('@site/static/img/sliders.svg').default,
    description: <>Build your own video player with a flexible compound component pattern.</>,
  },
  {
    title: 'Theming Support',
    Svg: require('@site/static/img/palette.svg').default,
    description: <>Easily customize the look and feel of your player to match your app's design.</>,
  },
  {
    title: 'Gesture Control',
    Svg: require('@site/static/img/gesture.svg').default,
    description: <>Out-of-the-box support for gestures like double-tap to seek and tap to toggle controls.</>,
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
