export const EvmProviders = () => {
  const [chains, setChains] = useState(null);
  const [tools, setTools] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://api.delora.build/v1/chains")
      .then((r) => r.json())
      .then((d) => setChains(d.chains))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    fetch("https://api.delora.build/v1/tools")
      .then((r) => r.json())
      .then(setTools)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!chains || !tools) return <div>Loading...</div>;

  const evmChains = chains.filter((c) => c.chainType === "EVM");

  const chainById = (id) => chains.find((c) => Number(c.id) === Number(id));

  const renderChains = (supportedChains) => (
    <div className="flex flex-wrap gap-3">
      {supportedChains.map((chain) => (
        <div key={chain.id} className="relative group">
          <img
            src={chain.logoURI}
            alt={chain.name}
            className="w-6 h-6 rounded-full not-prose"
          />
          <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
            {chain.name}
          </div>
        </div>
      ))}
    </div>
  );

  const hasEvmSupport = (tool) =>
    tool.supportedChains.some((id) =>
      evmChains.some((c) => Number(c.id) === Number(id))
    );

  const toolChains = (tool) =>
    tool.supportedChains
      .map(chainById)
      .filter(Boolean)
      .sort((a, b) => Number(a.id) - Number(b.id));

  const parsedBridges = tools.bridges
    .filter(hasEvmSupport)
    .map((bridge) => ({
      ...bridge,
      supportedChains: toolChains(bridge),
    }))
    .filter((bridge) => bridge.supportedChains.length)
    .sort((a, b) => b.supportedChains.length - a.supportedChains.length);

  const parsedExchanges = tools.exchanges
    .filter(hasEvmSupport)
    .map((exchange) => ({
      ...exchange,
      supportedChains: toolChains(exchange),
    }))
    .filter((exchange) => exchange.supportedChains.length)
    .sort((a, b) => b.supportedChains.length - a.supportedChains.length);

  return (
    <>
      <h2>Supported Bridges</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Key</th>
            <th>Supported Chains</th>
          </tr>
        </thead>
        <tbody>
          {parsedBridges.map((bridge) => (
            <tr key={bridge.key}>
              <td>
                <div className="flex items-center gap-2">
                  <img
                    src={bridge.logoURI}
                    className="w-4 h-4 rounded-full not-prose"
                    alt={bridge.name}
                  />
                  <strong>{bridge.name}</strong>
                </div>
              </td>

              <td>
                <code>{bridge.key}</code>
              </td>

              <td>{renderChains(bridge.supportedChains)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Supported Exchanges</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Key</th>
            <th>Supported Chains</th>
          </tr>
        </thead>
        <tbody>
          {parsedExchanges.map((exchange) => (
            <tr key={exchange.key}>
              <td>
                <div className="flex items-center gap-2">
                  <img
                    src={exchange.logoURI}
                    className="w-4 h-4 rounded-full not-prose"
                    alt={exchange.name}
                  />
                  <strong>{exchange.name}</strong>
                </div>
              </td>

              <td>
                <code>{exchange.key}</code>
              </td>

              <td>{renderChains(exchange.supportedChains)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
